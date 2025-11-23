interface TorrentFileDescriptor {
  path?: string | string[];
  name?: string;
  length: number;
  offset?: number;
}

interface ParsedTorrent {
  infoHash: string;
  name?: string;
  announce?: string[];
  urlList?: string[];
  length?: number;
  pieceLength?: number;
  lastPieceLength?: number;
  files?: TorrentFileDescriptor[];
  private?: boolean;
  created?: number;
  'created by'?: string;
  comment?: string;
  pieces?: Array<string | Uint8Array | Buffer>;
}

declare module 'parse-torrent' {
  function parseTorrent(
    torrent: Buffer | Uint8Array | string | Record<string, unknown>,
  ): ParsedTorrent;
  namespace parseTorrent {
    function toMagnetURI(parsed: ParsedTorrent): string;
  }
  export = parseTorrent;
}

declare module 'torrent-parser' {
  interface TorrentParser {
    decodeTorrent(buffer: Buffer | Uint8Array): ParsedTorrent;
  }

  const parser: TorrentParser;
  export = parser;
}
