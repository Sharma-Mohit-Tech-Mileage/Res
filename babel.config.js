module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'module:react-native-dotenv', // (if you use it or others)
    'react-native-reanimated/plugin', // keep this LAST
  ],
};