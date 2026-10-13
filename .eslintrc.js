// Guardrails: each rule bans a pattern already migrated away from, so it cannot creep back.
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    es2021: true,
    node: true,
  },
  // Injected by Metro at build time, so they exist at runtime but not in any env preset.
  globals: {
    __DEV__: 'readonly',
    fetch: 'readonly',
  },
  ignorePatterns: [
    'node_modules/**',
    'android/**',
    'ios/**',
    'build/**',
    'coverage/**',
    '*.config.js',
    'metro.config.js',
    'babel.config.js',
    'jest.config.js',
    'react-native.config.js',
  ],
  rules: {
    'no-restricted-imports': [
      'warn',
      {
        paths: [
          {
            name: 'react-native',
            importNames: [
              'Pressable',
              'TouchableOpacity',
              'TouchableHighlight',
              'TouchableWithoutFeedback',
            ],
            message:
              "Use the shared Touchable / IconButton / LinkText / CheckboxRow primitives from src/components/common/customui/ instead of raw react-native touchables. They guarantee the 48dp accessibility minimum touch target (Android Scanner / WCAG 2.5.5). Only Touchable.js itself may import Pressable directly.",
          },
        ],
        patterns: [
          {
            group: ['react-native-responsive-screen'],
            message:
              'Import { wp, hp } from src/utils/responsive instead. That shim matches this library below 600dp and clamps above it, so percentage widths stop stretching on large windows.',
          },
        ],
      },
    ],
    // A syntax rule, not a 2nd no-restricted-imports 'paths' entry - only the last entry per module wins.
    'no-restricted-syntax': [
      'warn',
      {
        selector:
          "ImportDeclaration[source.value='react-native'] > ImportSpecifier[imported.name='Dimensions']",
        message:
          'Dimensions.get() is read once and never updates, so layouts freeze at the size the app launched with. Use useWindowDimensions() in components, or the helpers in src/utils/responsive.js.',
      },
    ],
    // Catches never-imported variables; these throw at runtime and are otherwise invisible.
    'no-undef': 'error',
  },
  overrides: [
    {
      // Touchable.js is the primitive every other touchable wraps.
      files: ['src/components/common/customui/Touchable.js'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      // The only modules that legitimately read Dimensions; non-components must read at call time.
      files: [
        'src/utils/responsive.js',
        'src/components/utility/walkthroughHelpers.js',
        'src/components/splash/SplashScreen.js',
      ],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
    {
      files: ['__tests__/**'],
      env: { jest: true },
    },
  ],
};
