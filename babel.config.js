module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  if (process.env.NODE_ENV === 'production') {
    // Strip console.log and console.debug in production builds.
    // console.error and console.warn are kept for crash reporters.
    plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
  }

  // react-native-reanimated/plugin must always be last
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
