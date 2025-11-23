import { NextRequest, NextResponse } from "next/server";
import type {
  CoverImage,
  TorrentData,
  TorrentImageFile,
  TorrentParserFile,
  TorrentParserMetadata,
} from "../../../types/torrent";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".tiff",
  ".svg",
]);

const COVER_KEYWORDS = [
  "cover",
  "poster",
  "thumb",
  "banner",
  "fanart",
  "backdrop",
];

const toPathString = (path: string | string[]): string =>
  Array.isArray(path) ? path.join("/") : path;

const isImageFile = (file: TorrentParserFile): boolean => {
  const ext = toPathString(file.path).toLowerCase().split(".").pop();
  return Boolean(ext && IMAGE_EXTENSIONS.has(`.${ext}`));
};

const isPotentialCover = (file: TorrentParserFile): boolean => {
  const lowerName = toPathString(file.path).toLowerCase();
  return COVER_KEYWORDS.some((keyword) => lowerName.includes(keyword));
};

const normalizePieces = (
  pieces?: TorrentParserMetadata["pieces"]
): string[] => {
  if (!Array.isArray(pieces)) {
    return [];
  }

  return pieces.map((piece) => {
    if (typeof piece === "string") {
      return piece;
    }
    return Buffer.from(piece).toString("base64");
  });
};

const buildImagePayload = (
  files: TorrentParserFile[]
): {
  imageFiles: TorrentImageFile[];
  coverImages: CoverImage[];
  primaryCover: CoverImage | null;
} => {
  const imageCandidates = files.filter(isImageFile);
  const coverCandidates = imageCandidates.filter(isPotentialCover);

  const largestImage = imageCandidates.reduce<TorrentParserFile | null>(
    (largest, current) => {
      if (!largest || current.length > largest.length) {
        return current;
      }
      return largest;
    },
    null
  );

  const mapToImage = (file: TorrentParserFile): CoverImage => ({
    path: toPathString(file.path),
    name: file.name,
    length: file.length,
  });

  const imageFiles: TorrentImageFile[] = imageCandidates.map((file) => ({
    ...mapToImage(file),
    isCover: isPotentialCover(file),
  }));

  const coverImages = coverCandidates.map(mapToImage);
  const primaryCover = largestImage ? mapToImage(largestImage) : null;

  return { imageFiles, coverImages, primaryCover };
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parserModule = await import("torrent-parser");
    const torrentParser =
      "default" in parserModule ? parserModule.default : parserModule;
    const torrent = (
      torrentParser as {
        decodeTorrent: (input: Buffer) => TorrentParserMetadata;
      }
    ).decodeTorrent(buffer);

    if (!torrent?.infoHash) {
      return NextResponse.json(
        { error: "Could not parse torrent file" },
        { status: 400 }
      );
    }

    const files = torrent.files ?? [];
    const magnet = `magnet:?xt=urn:btih:${torrent.infoHash}`;
    const jsonPieces = normalizePieces(torrent.pieces);
    const totalSize =
      torrent.length ?? files.reduce((sum, current) => sum + current.length, 0);
    const fileCount = files.length || 1;
    const isMultiFile = files.length > 1;
    const { imageFiles, coverImages, primaryCover } = buildImagePayload(files);

    const response: TorrentData = {
      infoHash: torrent.infoHash,
      magnet,
      name: torrent.name,
      private: Boolean(torrent.private),
      created: torrent.created
        ? new Date(torrent.created * 1000).toISOString()
        : null,
      createdBy: torrent["created by"] ?? null,
      comment: torrent.comment ?? null,
      announce: torrent.announce ?? [],
      urlList: torrent.urlList ?? [],
      length: torrent.length ?? null,
      pieceLength: torrent.pieceLength ?? null,
      lastPieceLength: torrent.lastPieceLength ?? null,
      pieces: jsonPieces,
      files: files.map((fileMeta) => ({
        path: fileMeta.path,
        name: fileMeta.name,
        length: fileMeta.length,
        offset: fileMeta.offset,
      })),
      totalSize,
      fileCount,
      isMultiFile,
      imageFiles,
      coverImages,
      primaryCover,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error parsing torrent:", error);
    return NextResponse.json(
      { error: "Failed to parse torrent file" },
      { status: 500 }
    );
  }
}
