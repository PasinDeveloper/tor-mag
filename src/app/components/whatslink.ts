export interface WhatslinkImages {
  cover?: string;
  banner?: string;
  screenshots?: { time: string; screenshot: string }[];
  infoHash?: string;
}

export async function fetchWhatslinkImages(
  magnet: string
): Promise<WhatslinkImages | null> {
  try {
    const res = await fetch(
      `https://whatslink.info/api/v1/link?url=${encodeURIComponent(magnet)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (
      data &&
      (data.cover ||
        data.banner ||
        (data.screenshots && data.screenshots.length > 0))
    ) {
      return data;
    }
    return null;
  } catch (e) {
    console.error("Error fetching from whatslink.info:", e);
    return null;
  }
}
