import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
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
    },
    rules: {
      'no-unused-vars': "off", // Disable default ESLint rule
      '@typescript-eslint/no-unused-vars': [
        'warn', // or 'error' if you prefer
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          // Optionally, add this to explicitly ignore type imports (though usually not needed with modern versions)
          varsIgnorePattern: '^_', // Ignores variables starting with _ (optional)
        },
      ],
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);

