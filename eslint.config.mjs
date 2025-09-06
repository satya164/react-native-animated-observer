import { defineConfig, globalIgnores } from 'eslint/config';
import { react, recommended } from 'eslint-config-satya164';
import sort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  recommended,
  react,

  globalIgnores([
    '**/node_modules/',
    '**/coverage/',
    '**/dist/',
    '**/lib/',
    '**/.expo/',
    '**/.yarn/',
    '**/.vscode/',
  ]),

  {
    plugins: {
      'simple-import-sort': sort,
    },
  },
]);
