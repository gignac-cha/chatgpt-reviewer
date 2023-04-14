import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  outfile: 'api/serverless.js',
  platform: 'node',
  target: 'node18',
  bundle: true,
  minify: true,
});
