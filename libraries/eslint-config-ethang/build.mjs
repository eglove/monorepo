import { projectBuilder } from '@ethang/project-builder/project-builder.js';

await projectBuilder('eslint-config-ethang', 'main', {
  isLibrary: true,
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE', 'LINT'],
  ignorePeerDependencies: ['@rushstack/eslint-patch'],
})
