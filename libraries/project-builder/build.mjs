import { projectBuilder } from './dist/project-builder.js'

// pnpm tsup src/* --outDir dist --format esm --format cjs
await projectBuilder('project-builder', 'main', {
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE', 'LINT'],
  publishDirectory: 'dist',
  isLibrary: true,
  tsupOptions: {
    outDir: 'dist',
    entry: ['src/*']
  }
})
