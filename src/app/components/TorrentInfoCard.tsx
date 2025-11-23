"use client"

import React from "react";
import { LucideIcon } from "lucide-react";

interface TorrentInfoCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function TorrentInfoCard({ title, icon: Icon, children }: TorrentInfoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </h4>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
} 