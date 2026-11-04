export const extractCoords = (rect: DOMRect) => {
  const { top, left, width, height } = rect;
  return { top, left, width, height };
};
