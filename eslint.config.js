// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { URL } from 'url';

export default tseslint.config(
    // Ignore build output everywhere
    { ignores: ['dist', 'coverage'] },

    // Base JS rules (no TS types required)
    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ['src/**/*.ts'],
        extends: [...tseslint.configs.recommendedTypeChecked],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.eslint.json'],
                // Important for flat config so project path resolves correctly
                tsconfigRootDir: new URL('.', import.meta.url)
            },
            globals: { ...globals.node }
        },
        rules: {
            // your typed-rule tweaks here
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
        }
    },

    {
        files: ['test/**/*.{ts,tsx}', 'playground/**/*.{ts,tsx}'],
        languageOptions: {
            globals: { ...globals.node }
        },
        rules: {
            // Ensure typed-only rules are off in tests
            '@typescript-eslint/await-thenable': 'off',
            '@typescript-eslint/no-floating-promises': 'off'
        }
    },

    // Disable formatting rules that clash with Prettier
    eslintConfigPrettier
);
