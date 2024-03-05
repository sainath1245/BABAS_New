// export const presets = [['module:metro-react-native-babel-preset', {
//   unstable_disableES6Transforms: true
// }]];

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
// };

// module.exports = {
//   presets: [['module:metro-react-native-babel-preset', {
//     unstable_disableES6Transforms: true
//   }]],
// };

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin'
  ],
};