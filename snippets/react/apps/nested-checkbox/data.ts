import type { CheckboxItem } from "./types";

export const MOCK_DATA: CheckboxItem[] = [
  {
    id: '1',
    label: 'Electronics',
    children: [
      {
        id: '1-1',
        label: 'Phones',
        children: [
          { id: '1-1-1', label: 'iPhone' },
          { id: '1-1-2', label: 'Android' },
        ],
      },
      { id: '1-2', label: 'Laptops' },
    ],
  },
  {
    id: '2',
    label: 'Books',
    children: [
      { id: '2-1', label: 'Fiction' },
      { id: '2-2', label: 'Non-fiction' },
    ],
  },
]
