# Collage Maker

A Progressive Web App for creating image collages. Pick a layout, drop in your photos, export as PNG. No server, no upload, no signup — everything runs in the browser.

## Features

- 7 built-in layout templates (2-col, 3-col, 2-row, 2×2, big-left, big-top, 1+3)
- Drag-and-drop images from your filesystem or click to pick
- Live preview with `object-fit: cover` cropping
- Export to high-resolution PNG (2400px wide)
- Works offline — installable as a PWA

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Usage

1. Select a layout from the top bar
2. Click a slot or drag an image file into it
3. Click **Export PNG** to download the collage
4. Click **Reset** to clear all images

## Tech

Vanilla JS + Vite, plain CSS, Canvas API. No runtime dependencies.

## License

MIT
