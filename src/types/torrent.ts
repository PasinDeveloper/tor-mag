export interface TorrentFile {
  path: string | string[];
  name: string;
  length: number;
  offset?: number;
}

export interface TorrentImageFile {
  path: string;
  name: string;
  length: number;
  isCover: boolean;
}

export interface CoverImage {
  path: string;
  name: string;
  length: number;
}

export interface TorrentData {
  infoHash: string;
  magnet: string;
  name: string;
  private: boolean;
  created: string | null;
  createdBy: string | null;
  comment: string | null;
  announce: string[];
  urlList: string[];
  length: number | null;
  pieceLength: number | null;
  lastPieceLength: number | null;
  pieces: string[];
  files: TorrentFile[];
  totalSize: number;
  fileCount: number;
  isMultiFile: boolean;
  imageFiles: TorrentImageFile[];
  coverImages: CoverImage[];
  primaryCover: CoverImage | null;
}

export interface TorrentParserFile {
  path: string | string[];
  name: string;
  length: number;
  offset?: number;
}

export interface TorrentParserMetadata {
  infoHash: string;
  name: string;
  private?: boolean;
  created?: number;
  "created by"?: string;
  comment?: string;
  announce?: string[];
  urlList?: string[];
  length?: number;
  pieceLength?: number;
  lastPieceLength?: number;
  pieces?: Array<string | Uint8Array | Buffer>;
  files?: TorrentParserFile[];
}
