"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Copy,
  Check,
  Info,
  Shield,
  Calendar,
  User,
  MessageSquare,
  Globe,
  Link,
  HardDrive,
  Folder,
  File,
  Database,
  Layers,
  Package,
  FileVideo,
  FileAudio,
  FileImage,
  FileCode,
  FileArchive,
} from "lucide-react";

import TorrentHeader from "../components/TorrentHeader";
import TorrentExternalImages from "../components/TorrentExternalImages";
import TorrentInfoCard from "../components/TorrentInfoCard";
import TorrentSidebar from "../components/TorrentSidebar";
import { fetchWhatslinkImages, WhatslinkImages } from "../components/whatslink";
import Image from "next/image";
import type { TorrentData, TorrentFile } from "../../types/torrent";

export default function ResultsPage() {
  const [torrentData, setTorrentData] = useState<TorrentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [selectedTorrent, setSelectedTorrent] = useState<number | null>(null);
  const [externalImages, setExternalImages] = useState<WhatslinkImages | null>(
    null
  );
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load torrent data from localStorage if available
    const savedData = localStorage.getItem("torrentData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTorrentData(parsedData);
        if (parsedData.length > 0) {
          setSelectedTorrent(0); // Select the first torrent by default
        }
      } catch (loadError) {
        console.error("Failed to load saved torrent data", loadError);
      }
    }
  }, []);

  // Save torrent data to localStorage whenever it changes
  useEffect(() => {
    if (torrentData.length > 0) {
      localStorage.setItem("torrentData", JSON.stringify(torrentData));
    }
  }, [torrentData]);

  // Fetch external images when selected torrent changes
  useEffect(() => {
    async function fetchImages() {
      setLoadingImages(true);
      setExternalImages(null);
      if (selectedTorrent !== null && torrentData[selectedTorrent]) {
        const images = await fetchWhatslinkImages(
          torrentData[selectedTorrent].magnet
        );
        setExternalImages(images);
        console.log("[ResultsPage] externalImages:", images);
      }
      setLoadingImages(false);
      console.log("[ResultsPage] loadingImages:", false);
    }
    fetchImages();
  }, [selectedTorrent, torrentData]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    }
  };

  const handleCopyIndividual = async (link: string, index: number) => {
    const success = await copyToClipboard(link);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    if (torrentData.length === 0) return;

    const allLinks = torrentData.map((t) => t.magnet).join("\n");
    const success = await copyToClipboard(allLinks);
    if (success) {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext) return <File className="w-4 h-4" />;

    const videoExts = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"];
    const audioExts = ["mp3", "wav", "flac", "aac", "ogg", "wma"];
    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const archiveExts = ["zip", "rar", "7z", "tar", "gz"];
    const codeExts = [
      "txt",
      "pdf",
      "doc",
      "docx",
      "html",
      "css",
      "js",
      "ts",
      "json",
      "xml",
    ];

    if (videoExts.includes(ext)) return <FileVideo className="w-4 h-4" />;
    if (audioExts.includes(ext)) return <FileAudio className="w-4 h-4" />;
    if (imageExts.includes(ext)) return <FileImage className="w-4 h-4" />;
    if (archiveExts.includes(ext)) return <FileArchive className="w-4 h-4" />;
    if (codeExts.includes(ext)) return <FileCode className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;
    if (!files) return;

    const newTorrents: TorrentData[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/parse-torrent", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.infoHash) {
          newTorrents.push(result);
          console.log("Parsed torrent:", result);
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

    setTorrentData((prev) => [...prev, ...newTorrents]);
    setSelectedTorrent(torrentData.length); // Select the first new torrent
  };

  const removeTorrent = (index: number) => {
    setTorrentData((prev) => prev.filter((_, i) => i !== index));
    if (selectedTorrent === index) {
      setSelectedTorrent(
        torrentData.length > 1 ? Math.max(0, index - 1) : null
      );
    } else if (selectedTorrent !== null && selectedTorrent > index) {
      setSelectedTorrent(selectedTorrent - 1);
    }
  };

  const clearAll = () => {
    setTorrentData([]);
    setSelectedTorrent(null);
    localStorage.removeItem("torrentData");
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <TorrentSidebar
        torrentData={torrentData}
        error={error}
        onFilesChange={handleFiles}
        onRemoveTorrent={removeTorrent}
        onClearAll={clearAll}
        selectedTorrent={selectedTorrent}
        onSelectTorrent={setSelectedTorrent}
        formatFileSize={formatFileSize}
      />

      {/* Right Side - Results */}
      <div className="flex-1 flex flex-col">
        {torrentData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Torrents Added
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload some .torrent files to see results here
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Torrent Results
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {torrentData.length} torrent
                    {torrentData.length !== 1 ? "s" : ""} processed
                  </p>
                </div>
                <button
                  onClick={handleCopyAll}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  {allCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied All!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Magnet Links
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedTorrent !== null && torrentData[selectedTorrent] && (
                <div className="space-y-6">
                  <div className="flex space-x-3">
                    {/* Images - External only */}
                    {loadingImages ? (
                      <div className="w-1/3 h-[260px] text-center flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Loading images...
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Banner (first screenshot) */}
                        {externalImages &&
                        externalImages.screenshots &&
                        externalImages.screenshots.length > 0 ? (
                          <div className="relative w-1/3 h-[260px] flex items-center text-center align-middle justify-center">
                            <Image
                              fill
                              alt="Banner"
                              src={externalImages.screenshots[0].screenshot}
                              objectFit="cover"
                              className="w-full h-full rounded-xl shadow-lg border p-2 border-gray-700"
                            />
                          </div>
                        ) : (
                          <div className="w-1/3 h-[260px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
                            <span className="text-gray-400 dark:text-gray-600 text-lg">
                              No banner image available
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Torrent Header */}
                    <div className="w-2/3 h-[260px]">
                      <TorrentHeader
                        torrent={torrentData[selectedTorrent]}
                        index={selectedTorrent}
                        onCopy={handleCopyIndividual}
                        copiedIndex={copiedIndex}
                        formatFileSize={formatFileSize}
                      />
                    </div>
                  </div>

                  {loadingImages ? (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Loading images...
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Gallery/Card */}
                      <TorrentExternalImages
                        screenshots={
                          externalImages?.screenshots?.map(
                            (s) => s.screenshot
                          ) || []
                        }
                      />
                    </>
                  )}

                  {/* Basic Information */}
                  <TorrentInfoCard title="Basic Information" icon={Info}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Private:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">
                          {torrentData[selectedTorrent].private ? "Yes" : "No"}
                        </span>
                      </div>
                      {torrentData[selectedTorrent].created && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Created:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">
                            {new Date(
                              torrentData[selectedTorrent].created
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {torrentData[selectedTorrent].createdBy && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Created By:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">
                            {torrentData[selectedTorrent].createdBy}
                          </span>
                        </div>
                      )}
                      {torrentData[selectedTorrent].comment && (
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Comment:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">
                            {torrentData[selectedTorrent].comment}
                          </span>
                        </div>
                      )}
                    </div>
                  </TorrentInfoCard>

                  {/* Size Information */}
                  <TorrentInfoCard title="Size Information" icon={Database}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <HardDrive className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total Size:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-2">
                          {formatFileSize(
                            torrentData[selectedTorrent].totalSize
                          )}
                        </span>
                      </div>
                      {torrentData[selectedTorrent].pieceLength && (
                        <div className="flex items-center">
                          <Layers className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Piece Length:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-2">
                            {formatFileSize(
                              torrentData[selectedTorrent].pieceLength
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Pieces:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-2">
                          {torrentData[selectedTorrent].pieces.length}
                        </span>
                      </div>
                    </div>
                  </TorrentInfoCard>

                  {/* Trackers */}
                  {torrentData[selectedTorrent].announce.length > 0 && (
                    <TorrentInfoCard
                      title={`Trackers (${torrentData[selectedTorrent].announce.length})`}
                      icon={Globe}
                    >
                      <div className="space-y-2">
                        {torrentData[selectedTorrent].announce.map(
                          (tracker: string, i: number) => (
                            <div key={i} className="flex items-center text-sm">
                              <Link className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-400 font-mono">
                                {tracker}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </TorrentInfoCard>
                  )}

                  {/* Web Seeds */}
                  {torrentData[selectedTorrent].urlList.length > 0 && (
                    <TorrentInfoCard
                      title={`Web Seeds (${torrentData[selectedTorrent].urlList.length})`}
                      icon={Link}
                    >
                      <div className="space-y-2">
                        {torrentData[selectedTorrent].urlList.map(
                          (url: string, i: number) => (
                            <div key={i} className="flex items-center text-sm">
                              <Link className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-400 font-mono">
                                {url}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </TorrentInfoCard>
                  )}

                  {/* Files */}
                  <TorrentInfoCard
                    title={`Files (${torrentData[selectedTorrent].files.length})`}
                    icon={Folder}
                  >
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {torrentData[selectedTorrent].files.map(
                        (file: TorrentFile, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                          >
                            <div className="flex items-center flex-1 min-w-0">
                              {getFileIcon(file.name)}
                              <span className="text-sm text-gray-900 dark:text-gray-100 ml-2 truncate">
                                {Array.isArray(file.path)
                                  ? file.path.join("/")
                                  : file.path}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              {formatFileSize(file.length)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </TorrentInfoCard>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
