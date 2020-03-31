const path = require("path");

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-notes'
  ],
  webpackFinal: async config => {
    // do mutation to the config
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [['react-app', { flow: false, typescript: true }]],
            plugins: [
              require.resolve('@babel/plugin-proposal-class-properties'),
              // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
              require.resolve('babel-plugin-remove-graphql-queries'),
            ],
          },
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
      exclude: [
        /node_modules\/(?!(gatsby)\/)/
      ],
    });
    config.module.rules[0].include = require('path').resolve('../..');
    config.resolve.mainFields = ["browser", "module", "main"];
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
