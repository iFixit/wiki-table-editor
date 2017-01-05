module.exports = {
  entry: "./src/table-test.jsx",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  //externals: {
  //    "react": "React",
  //    "react-dom": "ReactDOM"
  //},
  module: {
    // noParse: ["react", "react-dom"],
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'es2016', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      }
    ]
  }
};