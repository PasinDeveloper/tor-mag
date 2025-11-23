"use client";

import React from "react";
import {
  FileText,
  Copy,
  Check,
  Magnet,
  Hash,
  HardDrive,
  Folder,
  FileImage,
} from "lucide-react";
import type { TorrentData } from "../../types/torrent";

interface TorrentHeaderProps {
  torrent: TorrentData;
  index: number;
  onCopy: (link: string, index: number) => void;
  copiedIndex: number | null;
  formatFileSize: (bytes: number) => string;
}

export default function TorrentHeader({
  torrent,
  index,
  onCopy,
  copiedIndex,
  formatFileSize,
}: TorrentHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border h-full w-full border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-1">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
          <div className="flex-1 min-w-0 max-w-full">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Torrent {index + 1}
              </span>
            </div>
            <h3 className="text-lg w-full md:max-w-2xl font-semibold text-gray-900 truncate dark:text-gray-100 mb-2">
              {torrent.name}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Hash className="w-4 h-4 mr-1" />
                <span className="font-mono truncate max-w-[100px] md:max-w-none">
                  {torrent.infoHash}
                </span>
              </div>
              <div className="flex items-center">
                <HardDrive className="w-4 h-4 mr-1" />
                <span>{formatFileSize(torrent.totalSize)}</span>
              </div>
              <div className="flex items-center">
                <Folder className="w-4 h-4 mr-1" />
                <span>
                  {torrent.fileCount} file{torrent.fileCount !== 1 ? "s" : ""}
                </span>
              </div>
              {torrent.primaryCover && (
                <div className="flex items-center">
                  <FileImage className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">
                    Has Cover
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onCopy(torrent.magnet, index)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 self-end md:self-start"
            title="Copy magnet link"
          >
            {copiedIndex === index ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Magnet Link */}
      <div className="px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-900 mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-2">
          <Magnet className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Magnet Link
          </span>
        </div>
        <div className="flex items-stretch bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
          <div className="flex-1 p-3 min-w-0 flex items-center">
            <code className="font-mono text-xs text-gray-600 dark:text-gray-300 truncate w-full select-all">
              {torrent.magnet}
            </code>
          </div>
          <button
            onClick={() => onCopy(torrent.magnet, index)}
            className="px-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-l border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-center group-hover:border-blue-400 dark:group-hover:border-blue-500"
            title="Copy Magnet Link"
          >
            {copiedIndex === index ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
