import htmlnano from "htmlnano";

const htmlnanoOptions = {
  collapseAttributeWhitespace: true,
  collapseBooleanAttributes: { amphtml: false },
  collapseWhitespace: "all",
  deduplicateAttributeValues: true,
  mergeScripts: true,
  mergeStyles: true,
  minifyAttributes: {
    metaContent: true,
    redundantWhitespaces: "agressive",
  },
  minifyCss: false,
  minifyConditionalComments: true,
  minifyHtmlTemplate: true,
  minifyJs: false,
  minifyJson: true,
  minifySvg: {},
  normalizeAttributeValues: true,
  removeAttributeQuotes: true,
  removeComments: "all",
  removeEmptyAttributes: true,
  removeEmptyElements: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeUnusedCss: false,
  sortAttributes: true,
  sortAttributesWithLists: "alphabetical",
};

const minifyHtml = async (html) => {
  const result = await htmlnano.process(html, htmlnanoOptions);

  return result.html;
};

export default minifyHtml;
