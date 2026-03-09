import { layouts } from './layouts.js';
import { renderLayoutPicker } from './ui/layout-picker.js';
import { renderCollageGrid } from './ui/collage-grid.js';
import { renderToolbar } from './ui/toolbar.js';

export const state = {
  selectedLayout: null,
  slots: [],
  gap: 4,
};

export function selectLayout(layout) {
  state.selectedLayout = layout;
  state.slots = Array.from({ length: layout.slots }, () => ({
    image: null,
    objectURL: null,
    pan: { x: 0, y: 0 },
    zoom: 1,
    naturalWidth: 0,
    naturalHeight: 0,
  }));
  renderLayoutPicker();
  renderCollageGrid();
}

export function setSlotImage(index, file) {
  if (state.slots[index].objectURL) {
    URL.revokeObjectURL(state.slots[index].objectURL);
  }
  state.slots[index].image = file;
  state.slots[index].objectURL = URL.createObjectURL(file);
  state.slots[index].pan = { x: 0, y: 0 };
  state.slots[index].zoom = 1;
  state.slots[index].naturalWidth = 0;
  state.slots[index].naturalHeight = 0;
}

export function resetCollage() {
  state.slots.forEach((slot) => {
    if (slot.objectURL) URL.revokeObjectURL(slot.objectURL);
  });
  if (state.selectedLayout) {
    state.slots = Array.from({ length: state.selectedLayout.slots }, () => ({
      image: null,
      objectURL: null,
      pan: { x: 0, y: 0 },
      zoom: 1,
      naturalWidth: 0,
      naturalHeight: 0,
    }));
  }
  renderCollageGrid();
}

export function init() {
  renderLayoutPicker();
  renderCollageGrid();
  renderToolbar();
  // Select first layout by default
  selectLayout(layouts[0]);
}
