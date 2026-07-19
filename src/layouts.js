export const layouts = [
  {
    id: 'side-by-side',
    name: '2 Columns',
    slots: 2,
    grid: {
      templateColumns: '1fr 1fr',
      templateRows: '1fr',
      templateAreas: null,
    },
  },
  {
    id: 'three-columns',
    name: '3 Columns',
    slots: 3,
    grid: {
      templateColumns: '1fr 1fr 1fr',
      templateRows: '1fr',
      templateAreas: null,
    },
  },
  {
    id: 'two-rows',
    name: '2 Rows',
    slots: 2,
    grid: {
      templateColumns: '1fr',
      templateRows: '1fr 1fr',
      templateAreas: null,
    },
  },
  {
    id: 'two-by-two',
    name: '2×2 Grid',
    slots: 4,
    grid: {
      templateColumns: '1fr 1fr',
      templateRows: '1fr 1fr',
      templateAreas: null,
    },
  },
  {
    id: 'step-horizontal',
    name: 'Step →',
    slots: 4,
    grid: {
      templateColumns: '1fr 1fr 1fr',
      templateRows: '1fr 1fr',
      templateAreas: `"a a b" "c d d"`,
    },
  },
  {
    id: 'step-vertical',
    name: 'Step ↓',
    slots: 4,
    grid: {
      templateColumns: '1fr 1fr',
      templateRows: '1fr 1fr 1fr',
      templateAreas: `"a b" "a d" "c d"`,
    },
  },
  {
    id: 'big-left',
    name: 'Big Left',
    slots: 3,
    grid: {
      templateColumns: '2fr 1fr',
      templateRows: '1fr 1fr',
      templateAreas: `"a b" "a c"`,
    },
  },
  {
    id: 'big-top',
    name: 'Big Top',
    slots: 3,
    grid: {
      templateColumns: '1fr 1fr',
      templateRows: '2fr 1fr',
      templateAreas: `"a a" "b c"`,
    },
  },
  {
    id: 'one-plus-three',
    name: '1 + 3 Right',
    slots: 4,
    grid: {
      templateColumns: '2fr 1fr',
      templateRows: '1fr 1fr 1fr',
      templateAreas: `"a b" "a c" "a d"`,
    },
  },
  {
    id: 'single',
    name: 'Single Image',
    slots: 1,
    grid: {
      templateColumns: '1fr',
      templateRows: '1fr',
      templateAreas: null,
    },
  },
];
