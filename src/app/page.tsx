import TorrentConverter from "./components/TorrentConverter";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 mt-10 text-center text-gray-900 dark:text-gray-100">
        .torrent to Magnet Link Converter
      </h1>
      <TorrentConverter />
    </div>
  );
}
