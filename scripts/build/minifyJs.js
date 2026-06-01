import UglifyJS from "uglify-js";

const uglifyOptions = {
  compress: {
    booleans: true,
    collapse_vars: true,
    comparisons: true,
    dead_code: true,
    drop_console: false,
    evaluate: true,
    hoist_funs: true,
    hoist_vars: true,
    if_return: true,
    inline: 3,
    join_vars: true,
    passes: 3,
    reduce_funcs: true,
    reduce_vars: true,
    sequences: true,
    toplevel: true,
    typeofs: true,
    unused: true,
  },
  mangle: {
    toplevel: true,
  },
  module: true,
  output: {
    comments: false,
  },
  toplevel: true,
};

const minifyJs = (js, filePath) => {
  const result = UglifyJS.minify({ [filePath]: js }, uglifyOptions);

  if (result.error) {
    throw result.error;
  }

  return result.code;
};

export default minifyJs;
