import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      eslintConfigPrettier,
    ],
    files: ['./src/**/*.tsx', './src/**/*.ts'],
    plugins: {
      react,
      'prettier': eslintConfigPrettier,
      '@stylistic/ts': stylistic,
      '@typescript-eslint/eslint-plugin': tsEslintPlugin
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2020,
      globals: globals.browser,
      rules: {
        ...globals.browser,
        ...js.configs.recommended.rules,
        ...tseslint.configs.strictTypeChecked.rules,
        ...tseslint.configs.stylisticTypeChecked.rules,
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
        "no-unused-vars": "error",
        "no-undef": "error",
        "prefer-const": "error",
        "no-console": "warn",
        "prettier/prettier": 2 // Means error
      }
    },
  },
)
