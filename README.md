# Collage Maker

A Progressive Web App for creating image collages. Pick a layout, drop in your photos, export as PNG. No server, no upload, no signup — everything runs in the browser.

## Features

- 9 built-in layout templates (2-col, 3-col, 2-row, 2×2, step splits, big-left, big-top, 1+3)
- Drag-and-drop images from your filesystem or click to pick
- Live preview, pan and zoom each image within its slot
- Draggable gap dividers — resize slot proportions by dragging the gaps between images
- Aspect ratio presets — 1:1, 4:3, 3:2, 16:9, 9:16, 3:4
- Background/gap color picker
- Export to high-resolution PNG (2400px wide) reflecting pan, zoom, proportions, and background color
- Works offline — installable as a PWA

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build                        # outputs to dist/, served from /
BASE_PATH=/collage/ npm run build    # build for a subfolder deployment
npm run preview                      # preview the production build
```

The `BASE_PATH` environment variable sets the base URL for all assets, the service worker, and the web app manifest. Use a leading and trailing slash (e.g. `/collage/`). Omitting it defaults to `/`.

## Usage

1. Select a layout from the top bar
2. Click a slot or drag an image file into it
3. Pan by dragging, zoom with scroll or pinch
4. Drag the gaps between slots to resize proportions
5. Use the toolbar to pick an aspect ratio and background color
6. Click **Export PNG** to download the collage
7. Click **Reset** to clear all images

## Tech

Vanilla JS + Vite, plain CSS, Canvas API. No runtime dependencies.

## License

MIT
