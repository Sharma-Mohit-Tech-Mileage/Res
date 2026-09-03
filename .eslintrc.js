// Accessibility guardrail: bans raw touchable imports outside Touchable.js so
// every interactive element clears 48dp (Android Scanner / WCAG 2.5.5). Severity
// is 'warn' — flip to 'error' after migrating the remaining raw callsites.
// Doesn't extend @react-native/eslint-config to avoid surfacing unrelated
// findings; add `extends: ['@react-native']` later if desired.
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
      },
    ],
  },
  overrides: [
    {
      // Touchable.js is the one file where Pressable may be imported directly —
      // it's the primitive every other touchable wraps.
      files: ['src/components/common/customui/Touchable.js'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
