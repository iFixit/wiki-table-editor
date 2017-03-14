function getConfig(env) {
  var entry = './src/wiki-table-editor.jsx';
  var outFile = 'wiki-table-editor.js';

  // Don't include React and ReactDOM since they are already included on the
  // page.
  var externals = {
    'react': 'React',
    'react-dom': 'ReactDOM'
  };
  var noParse = ['react', 'react-dom'];

  // For `webpack --env.dev` builds, include React so that we can test it more
  // easily.
  if (env.dev) {
    entry = './src/demo.jsx';
    outFile = 'demo.js';
    externals = {};
    noParse = [];
  }

  return {
    entry: entry,
    output: {
      path: __dirname + '/dist',
      filename: outFile,
      library: 'WikiTableEditor'
    },
    externals: externals,
    module: {
      noParse: noParse,
      loaders: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'es2016', 'react'],
            plugins: ['transform-object-rest-spread']
          }
        }
      ]
    }
  };
};

// In webpack 2.0, this will just be `module.exports = getConfig`.
// For now, simulate the 'env' behavior.
console.log(process.argv);
if (process.argv.length >= 3 && process.argv[2] == '--env.dev') {
  module.exports = getConfig({dev: true});
} else {
  module.exports = getConfig({});
}
