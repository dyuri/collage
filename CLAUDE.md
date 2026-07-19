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
  app.js              # global state + selectLayout / setSlotImage / resetCollage / setAspectRatio / setBgColor / setOverlayImage / clearOverlay
  layouts.js          # layout definitions (data only), incl. single-slot "Single Image" layout
  export.js           # Canvas rendering + PNG download
  ui/
    layout-picker.js  # renders layout thumbnail buttons
    collage-grid.js   # renders CSS Grid, draggable dividers, ResizeObserver, overlay layer
    slot.js           # individual slot: file input + drag-and-drop + pan/zoom
    toolbar.js        # aspect ratio dropdown, BG color picker, overlay picker, Export and Reset buttons
  styles/             # one CSS file per UI section
sw.js                 # cache-first service worker
manifest.json         # PWA manifest
icons/                # 192x192 and 512x512 PNG icons
```

## Key Conventions
- State lives in `app.js` (`state` object). UI modules import `state` directly; they never own state.
- Re-rendering is done by calling `renderCollageGrid()` / `renderLayoutPicker()` — simple full re-render, no virtual DOM.
- Layout definitions in `layouts.js` use `templateAreas` (string) for complex layouts or `null` for auto-flow.
- `state.columnSizes` / `state.rowSizes` hold the current `fr` values, parsed from the layout's `templateColumns`/`templateRows` on selection and mutated live during divider drag.
- Draggable dividers are absolutely positioned children of the grid (taken out of grid flow). They update `state.columnSizes`/`state.rowSizes` and call `applyGridSizes()` directly without a full re-render.
- A `ResizeObserver` on the collage grid calls `repositionAllImages()` whenever the grid resizes (covers window resize and aspect ratio changes).
- Image positioning uses explicit `width/height/left/top` (not `object-fit`) so the full original image is accessible for panning. `positionImage()` in `slot.js` calculates cover-scale manually.
- Export reads live `getBoundingClientRect()` on slot elements and scales to `OUTPUT_WIDTH = 2400px`. The `coverCrop()` function replicates pan/zoom in source coordinates for `drawImage`.
- `state.bgColor` is applied to the grid element background (controls gap/border color in preview) and to the canvas fill in export.
- Object URLs are created in `setSlotImage` and revoked on slot replacement or reset.
- `state.overlay` (`{ file, objectURL }`) holds a single full-bleed transparent PNG stretched over the whole grid (not per-slot), independent of layout/slot state — not cleared by `resetCollage()` or `selectLayout()`. `setOverlayImage()`/`clearOverlay()` update it directly via `updateOverlay()` (collage-grid.js) and `renderToolbar()`, without a full `renderCollageGrid()`. In the DOM it's a `.collage-overlay` `<img>` (`z-index: 5`, `pointer-events: none`) appended inside `#collage-grid`, above slots but below the dividers (`z-index: 10`). Export draws it last with `drawImage(img, 0, 0, OUTPUT_WIDTH, outputHeight)`, stretching it to match the canvas exactly (same stretch behavior as the preview's `width/height: 100%`).

## No Dependencies
Zero runtime dependencies. Keep it that way unless there is a strong reason.
