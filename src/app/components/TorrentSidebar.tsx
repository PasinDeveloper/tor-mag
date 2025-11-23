"use client"

import React from "react";
import { 
  AlertCircle, 
  FileText, 
  X, 
  Plus,
  Image as ImageIcon
} from "lucide-react";
import type { TorrentData } from "../../types/torrent";

interface TorrentSidebarProps {
  torrentData: TorrentData[];
  error: string | null;
  onFilesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveTorrent: (index: number) => void;
  onClearAll: () => void;
  selectedTorrent: number | null;
  onSelectTorrent: (index: number) => void;
  formatFileSize: (bytes: number) => string;
}

export default function TorrentSidebar({
  torrentData,
  error,
  onFilesChange,
  onRemoveTorrent,
  onClearAll,
  selectedTorrent,
  onSelectTorrent,
  formatFileSize
}: TorrentSidebarProps) {
  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Add More Torrents
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload additional .torrent files
        </p>
      </div>

      {/* Upload Area */}
      <div className="p-6 flex-1">
        <div className="relative">
          <input
            type="file"
            accept=".torrent"
            multiple
            onChange={onFilesChange}
            className="hidden"
            id="torrent-input"
          />
          <label
            htmlFor="torrent-input"
            className="block w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 bg-gray-50 dark:bg-gray-800"
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Add More Files
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Drop .torrent files here
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-xs text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Torrent List */}
        {torrentData.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Added Torrents ({torrentData.length})
              </h3>
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {torrentData.map((torrent, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTorrent === idx
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => onSelectTorrent(idx)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <FileText className="w-3 h-3 text-gray-500 mr-2" />
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                          {torrent.name}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(torrent.totalSize)}</span>
                        {torrent.primaryCover && (
                          <ImageIcon className="w-3 h-3 ml-2 text-green-500" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTorrent(idx);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 