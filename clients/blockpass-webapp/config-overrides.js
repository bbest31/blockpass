const webpack = require('webpack');

module.exports = function override(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-url-loader',
        options: {
          iesafe: true,
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
