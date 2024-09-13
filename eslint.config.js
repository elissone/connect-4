import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import parser from '@typescript-eslint/parser'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      tsEslintPlugin.configs.strictTypeChecked,
      stylistic.configs.stylisticTypeChecked,
    ],
    files: ['./**/*.tsx', './**/*.ts'],
    plugins: {
      react,
      '@stylistic/ts': stylistic,
      '@typescript-eslint/eslint-plugin': tsEslintPlugin
    },
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: 2020,
      globals: globals.browser,
      rules: {
        '@typescript-eslint/no-unused-vars': 'on',
        '@typescript-eslint/semi': 'on',
      }
    },
  },
)
