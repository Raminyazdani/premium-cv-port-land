import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

/**
 * Allowed strings for jsx-no-literals rule.
 * These are intentionally allowed as they are:
 * - Punctuation/separators used for layout
 * - Icons/symbols/decorators
 * - Technical characters for code/formatting
 * - Whitespace characters
 */
const I18N_ALLOWED_STRINGS = [
  // Punctuation & separators
  '–', '|', ':', ',', '.', '/', '\\', '-',
  // Symbols & operators
  '+', '×', '✓', '✕', '•', '…', '&', '*', '#',
  // Brackets & delimiters
  '(', ')', '[', ']', '{', '}', '<', '>',
  // Comparison & logic
  '=', '!', '?', '%', '$', '^', '~', '`',
  // Quotes
  '"', "'", '@',
  // Whitespace
  '\n', '\t', ' ',
]

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage', 'playwright-report', 'test-results', 'e2e-screenshots'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      /**
       * i18n enforcement: Warn on hardcoded string literals in JSX.
       * 
       * This rule helps catch user-visible text that should use the i18n system.
       * Use `useTranslation()` hook and `t.` namespace instead of hardcoded strings.
       * 
       * ALLOWLIST: Single characters defined in I18N_ALLOWED_STRINGS above.
       * Props are ignored (className, aria-*, data-*, role, etc.)
       * 
       * TO BYPASS (rare, reviewed): Add an eslint-disable comment:
       *   // eslint-disable-next-line react/jsx-no-literals
       *   <span>Allowed literal</span>
       * 
       * @see frontend/QA_FIX_REPORT.md for full documentation
       */
      'react/jsx-no-literals': [
        'warn',
        {
          noStrings: true,
          allowedStrings: I18N_ALLOWED_STRINGS,
          ignoreProps: true,
          noAttributeStrings: false,
        },
      ],

      /**
       * Prevent console.log in production code.
       * 
       * Use console.warn and console.error for warnings/errors.
       * For development-only logging, guard with: if (import.meta.env.DEV)
       * 
       * @see docs/CODING_CONVENTIONS.md
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      /**
       * Prevent large files (max 400 lines).
       * 
       * Blank lines and comments are excluded from the count.
       * If a file must be larger, add a file-specific override below.
       * 
       * @see docs/CODING_CONVENTIONS.md
       */
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],

      /**
       * Prevent large functions (max 80 lines).
       * 
       * This encourages breaking down complex logic into smaller, testable units.
       * Blank lines and comments are excluded from the count.
       * 
       * @see docs/CODING_CONVENTIONS.md
       */
      'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },
  /**
   * File-specific overrides for legitimately large files.
   * 
   * These files are excluded from max-lines rules because:
   * - Generated UI components (src/components/ui/*)
   * - i18n translation file (necessarily large with all translations)
   * - Config/mapping files (data configuration)
   */
  {
    files: [
      'src/components/ui/**/*.tsx',
      'src/lib/i18n.ts',
      'src/config/keyMappings.ts',
      'src/config/skillCategoryMappings.ts',
    ],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  prettierConfig,
)
