import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  dts: true,
  target: 'es2016',
  format: ['cjs', 'esm'],
  // 不需要打包的模块
  external: ['electron'],
  tsconfig: './tsconfig.json',
  minify: true,
});
