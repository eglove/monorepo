import { projectBuilder } from '@ethang/project-builder/project-builder.js';

await projectBuilder('toolbelt', 'main', {
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE', 'LINT'],
  publishDirectory: 'dist',
  isLibrary: true,
  tsupOptions: {
    format: ['cjs', 'esm'],
    minify: true,
    outDir: 'dist',
    entry: ['src']
  }
})