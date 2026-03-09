# Collage Maker — Claude Notes

## Stack
- Vanilla JS (ES modules), no frameworks
- Vite for dev server and bundling
- Plain CSS with custom properties
- Canvas API for PNG export

## Commands
```
npm run dev      # dev server at localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Project Structure
```
src/
  main.js             # entry: registers SW, calls init()
  app.js              # global state + selectLayout / setSlotImage / resetCollage
  layouts.js          # layout definitions (data only)
  export.js           # Canvas rendering + PNG download
  ui/
    layout-picker.js  # renders layout thumbnail buttons
    collage-grid.js   # renders CSS Grid from selected layout
    slot.js           # individual slot: file input + drag-and-drop
    toolbar.js        # Export and Reset buttons
  styles/             # one CSS file per UI section
sw.js                 # cache-first service worker
manifest.json         # PWA manifest
icons/                # 192x192 and 512x512 PNG icons
```

## Key Conventions
- State lives in `app.js` (`state` object). UI modules import `state` directly; they never own state.
- Re-rendering is done by calling `renderCollageGrid()` / `renderLayoutPicker()` — simple full re-render, no virtual DOM.
- Layout definitions in `layouts.js` use `templateAreas` (string) for complex layouts or `null` for auto-flow.
- Export reads live `getBoundingClientRect()` on slot elements and scales to `OUTPUT_WIDTH = 2400px`.
- `object-fit: cover` crop is replicated manually in `export.js` (`coverCrop` function).
- Object URLs are created in `setSlotImage` and revoked on slot replacement or reset.

## No Dependencies
Zero runtime dependencies. Keep it that way unless there is a strong reason.
