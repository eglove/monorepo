import { projectBuilder } from '@ethang/project-builder/project-builder.js';

// pnpm tsup src/* --outDir dist --format esm --format cjs
await projectBuilder('toolbelt', 'main', {
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE', 'LINT'],
  publishDirectory: 'dist',
  isLibrary: true,
  tsupOptions: {
    outDir: 'dist',
    entry: ['src/*']
  }
})
