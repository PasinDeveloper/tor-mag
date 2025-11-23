"use client"

import React from "react";
import Image from "next/image";
import { GalleryHorizontal } from "lucide-react";

interface TorrentExternalImagesProps {
  screenshots?: string[];
}

export default function TorrentExternalImages({ screenshots }: TorrentExternalImagesProps) {
  const hasScreenshots = screenshots && screenshots.length > 0;
  const screenshotPlaceholders = Array.from({ length: 4 });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
        <GalleryHorizontal className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Screenshots</span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hasScreenshots
            ? screenshots!.map((url, i) => (
                <div key={i} className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-40 w-full">
                  <div className="relative flex-1 w-full h-28">
                    <Image
                      src={url}
                      alt={`Screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover rounded shadow"
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Screenshot {i + 1} (from whatslink.info)</span>
                </div>
              ))
            : screenshotPlaceholders.map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-40 w-full">
                  <div className="flex-1 flex items-center justify-center w-full">
                    <GalleryHorizontal className="w-10 h-10 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Screenshot {i + 1} (from whatslink.info)</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
} 