# Tor-Mag

> Local-first torrent inspector that turns loose `.torrent` files into a clean metadata dashboard.

Tor-Mag is a Next.js App Router project that parses uploaded torrent files, enriches them with imagery hints, and lets you review every file inside before deciding what to share. Everything happens in the browser except for the parsing API, so you can safely iterate on the UI without persisting data server-side.

## Feature Highlights

- Drag-and-drop uploader (`src/app/page.tsx`) streams each torrent to `/api/parse-torrent`, which buffers the file, decodes it via `torrent-parser`, and enriches totals, file counts, and cover image candidates.
- Results view (`src/app/results/page.tsx`) hydrates from `localStorage` (`torrentData`) so multiple tabs stay in sync and mutations auto-save.
- Cover heuristics flag likely posters plus external screenshots from Whatslink rendered through `next/image`.
- Sidebar lets you focus on a single file, copy magnets, or remove torrents while keeping derived sizes formatted consistently.
- Client components lean on Tailwind CSS v4 and `lucide-react` icons for a minimal bundle.

## Architecture & Data Flow

- **Routes**
  - `src/app/page.tsx`: `TorrentConverter` client component, accepts file drops and kicks off the parse flow.
  - `src/app/results/page.tsx`: Inspector UI that reads/writes `torrentData` from `localStorage` so new tabs pick up the latest state.
- **Components** live in `src/app/components/*`; they all share the `TorrentData` interface declared in `results/page.tsx`. Update that interface first, then pass props through.
- **API routes**
  - `/api/parse-torrent`: single ingestion point; buffers uploads, calls CommonJS `torrent-parser`, adds derived statistics, and picks `primaryCover` (largest image) plus `coverImages`.
- **External fetchers**:
  - `fetchWhatslinkImages` (`components/whatslink.ts`) calls Whatslink directly from the browser—guard failures and treat `null` as “no screenshots”.

## Getting Started

```bash
npm install            # install dependencies
npm run dev            # starts Next.js on http://localhost:3002
npm run lint           # eslint 9 + next lint rules
npm run build          # production build check
```

### Usage

1. Run `npm run dev` and open [http://localhost:3002](http://localhost:3002).
2. Drag one or more `.torrent` files onto the uploader; the parser response is persisted to `localStorage` as `torrentData`.
3. You will be redirected to `/results`, where you can inspect metadata, copy magnets, and toggle individual files.
4. Open `/results` in another tab to confirm real-time sync.

## Environment & Configuration

- Remote images render through `next/image`. If you introduce new hosts, add them to `images.domains` inside `next.config.ts` before deploying.
- Tailwind CSS v4 is imported globally from `src/app/globals.css`; extend design tokens there instead of scattered inline styles.

## Development Tips

- Extend the `TorrentData` interface in `results/page.tsx` before touching components so types stay aligned.
- When debugging parsing issues, add `console.log` statements inside `/api/parse-torrent` and compare outputs with what lands in `localStorage`.
- No automated tests yet—run `npm run lint` plus a production `npm run build` before committing.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
