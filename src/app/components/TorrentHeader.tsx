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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border h-full w-full border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 max-w-full">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Torrent {index + 1}
              </span>
            </div>
            <h3 className="text-lg w-2xl font-semibold text-gray-900 truncate dark:text-gray-100 mb-2">
              {torrent.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Hash className="w-4 h-4 mr-1" />
                <span className="font-mono">{torrent.infoHash}</span>
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
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
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
      <div className="px-6 py-4 h-full bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Magnet className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Magnet Link
            </span>
          </div>
          <button
            onClick={() => onCopy(torrent.magnet, index)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
          >
            Copy
          </button>
        </div>
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg p-3">
          <code className="text-xs text-gray-800 dark:text-gray-200 break-all font-mono">
            {torrent.magnet}
          </code>
        </div>
      </div>
    </div>
  );
}
