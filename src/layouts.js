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
];
