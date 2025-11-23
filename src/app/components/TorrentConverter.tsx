"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, AlertCircle, Eye } from "lucide-react";
import type { TorrentData } from "../../types/torrent";

export default function TorrentConverter() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!mounted) return;

    setError(null);
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setIsProcessing(true);

    const torrents: TorrentData[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/parse-torrent", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.infoHash) {
          torrents.push(result);
        } else {
          setError(
            `Error parsing ${file.name}: ${result.error || "Unknown error"}`
          );
        }
      } catch (uploadError) {
        console.error(`Error parsing .torrent file: ${file.name}`, uploadError);
        setError(`Error parsing .torrent file: ${file.name}`);
      }
    }

    event.target.value = "";
    setIsProcessing(false);

    if (torrents.length > 0) {
      localStorage.setItem("torrentData", JSON.stringify(torrents));
      router.push("/results");
    }
  };

  const viewResults = () => {
    router.push("/results");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="text-center mb-4 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Torrent to Magnet Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
          Upload .torrent files to get comprehensive information and magnet
          links
        </p>
      </div>

      {/* File Upload Area */}
      <div className="w-full max-w-md mb-4 md:mb-8">
        <div className="relative">
          <input
            type="file"
            accept=".torrent"
            multiple
            onChange={mounted ? handleFiles : undefined}
            className="hidden"
            id="torrent-input"
          />
          <label
            htmlFor="torrent-input"
            className={`block w-full p-4 md:p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors duration-200 ${
              isProcessing
                ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-800"
            }`}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                {isProcessing ? (
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {isProcessing ? "Processing..." : "Drop .torrent files here"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isProcessing
                    ? "Please wait while we parse your files"
                    : "or click to browse"}
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-2xl mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* View Results Button */}
      {!isProcessing && (
        <div className="text-center">
          <button
            onClick={viewResults}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Eye className="w-5 h-5 mr-2" />
            View Results Page
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Access detailed torrent information and add more files
          </p>
        </div>
      )}
    </div>
  );
}
