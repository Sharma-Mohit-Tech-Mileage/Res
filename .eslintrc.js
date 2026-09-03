// Guardrails, not style rules: each one bans a pattern we have already migrated
// away from, so the fix cannot creep back in a later PR.
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
    // Kept as a syntax rule rather than a second no-restricted-imports entry:
    // that rule honours only the last 'paths' entry per module, so adding one
    // here would have silently switched off the touchable guardrail above.
    'no-restricted-syntax': [
      'warn',
      {
        selector:
          "ImportDeclaration[source.value='react-native'] > ImportSpecifier[imported.name='Dimensions']",
        message:
          'Dimensions.get() is read once and never updates, so layouts freeze at the size the app launched with. Use useWindowDimensions() in components, or the helpers in src/utils/responsive.js.',
      },
    ],
    // Catches references to variables that were never imported - these throw at
    // runtime and are otherwise invisible. Clean as of the 51768 sweep.
    'no-undef': 'error',
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
    {
      // The three modules that legitimately read Dimensions: the responsive
      // helpers themselves, and two non-component modules that have no hook to
      // call and so must read at call time.
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
