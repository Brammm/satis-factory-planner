import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';

export default tseslint.config(
    { ignores: [ 'dist' ] },
    {
        extends: [ js.configs.recommended, ...tseslint.configs.recommended ],
        files: [ '**/*.{ts,tsx}' ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'simple-import-sort': eslintPluginSimpleImportSort,
            'sort-destructure-keys': sortDestructureKeys,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'sort-destructure-keys/sort-destructure-keys': 'error',
            'simple-import-sort/imports': [
                'error',
                {
                    'groups': [
                        [
                            '^react',
                            '^next',
                            '^@?\\w'
                        ],
                        [
                            '^(@|components)(/.*|$)'
                        ]
                    ]
                }
            ],
        },
    },
);
