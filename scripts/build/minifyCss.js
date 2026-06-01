import postcss from "postcss";
import cssnano from "cssnano";

const cssnanoOptions = {
  preset: [
    "default",
    {
      discardComments: { removeAll: true },
      normalizeWhitespace: true,
      minifyFontValues: { removeQuotes: true },
      convertValues: { length: true },
      mergeLonghand: true,
      mergeRules: true,
      minifySelectors: true,
      normalizePositions: true,
      normalizeRepeatStyle: true,
      normalizeString: true,
      normalizeTimingFunctions: true,
      normalizeUnicode: true,
      orderedValues: true,
      reduceIdents: true,
      svgo: true,
    },
  ],
};

const minifyCss = async (css) => {
  const result = await postcss([cssnano(cssnanoOptions)]).process(css, {
    from: undefined,
  });

  return result.css;
};

export default minifyCss;
