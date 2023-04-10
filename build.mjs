import { build } from 'esbuild';

build({
  entryPoints: ['src/server.ts'],
  outfile: 'public/server.js',
  platform: 'node',
  target: 'node18',
  bundle: true,
  minify: true,
});
