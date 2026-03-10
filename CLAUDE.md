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
  app.js              # global state + selectLayout / setSlotImage / resetCollage / setAspectRatio / setBgColor
  layouts.js          # layout definitions (data only)
  export.js           # Canvas rendering + PNG download
  ui/
    layout-picker.js  # renders layout thumbnail buttons
    collage-grid.js   # renders CSS Grid, draggable dividers, ResizeObserver
    slot.js           # individual slot: file input + drag-and-drop + pan/zoom
    toolbar.js        # aspect ratio dropdown, BG color picker, Export and Reset buttons
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

## No Dependencies
Zero runtime dependencies. Keep it that way unless there is a strong reason.
