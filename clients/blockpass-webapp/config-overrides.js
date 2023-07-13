const webpack = require('webpack');

module.exports = function override(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      },
    ],
  });

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
