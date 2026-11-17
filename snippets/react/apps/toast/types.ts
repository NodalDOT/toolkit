export type ToastItem = {
  text: string;
  id: number;
};
export type ToastMethod = {
  toast: (item: ToastItem) => void;
};
