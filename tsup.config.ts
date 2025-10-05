import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'daktronics/index': 'src/daktronics/index.ts'
    },
    format: ['esm', 'cjs'],
    dts: true, // .d.ts for each entry
    sourcemap: true,
    clean: true,
    target: 'es2020',
    splitting: false,
    outDir: 'dist'
});
