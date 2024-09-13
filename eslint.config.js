import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'


export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    files: ['./**/*.tsx', './**/*.ts'],
    plugins: {
      react,
      '@stylistic/ts': stylistic,
      '@typescript-eslint/eslint-plugin': tsEslintPlugin
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
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
      }
    },
  },
)
