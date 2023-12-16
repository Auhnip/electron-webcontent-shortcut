import { defineConfig } from 'tsup';

// 开发环境下，编译测试代码
export default defineConfig({
  entry: ['src/example/index.ts'],
  outDir: 'dist/example',
  target: 'es2016',
  format: ['cjs', 'esm'],
  // 不需要打包的模块
  external: ['electron'],
  tsconfig: './tsconfig.json',
});
