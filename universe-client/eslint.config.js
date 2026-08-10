import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(?:[A-Z_]|motion$)',
          argsIgnorePattern: '^(?:[A-Z_]|index$)',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: [
      'src/components/ui/badge.jsx',
      'src/components/ui/button.jsx',
      'src/components/ui/evervault-card.jsx',
      'src/components/ui/navigation-menu.jsx',
      'src/context/ThemeContext.jsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/components/ui/background-beams.jsx'],
    rules: {
      'react-hooks/purity': 'off',
    },
  },
  {
    files: [
      'src/components/layout/AdminLayout.jsx',
      'src/components/ui/SplitText.jsx',
      'src/components/ui/macbook-scroll.jsx',
      'src/components/ui/placeholders-and-vanish-input.jsx',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: [
      'src/components/common/ClubDetailModal.jsx',
      'src/components/ui/placeholders-and-vanish-input.jsx',
      'src/components/ui/typewriter-effect.jsx',
      'src/pages/public/MyBookings.jsx',
    ],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
    },
  },
])
