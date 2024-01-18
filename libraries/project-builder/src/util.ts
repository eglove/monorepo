import { simpleGit } from 'simple-git';

export async function getHasChanges(branch: string): Promise<boolean> {
  const diffSummary = await simpleGit()
    .fetch()
    .diffSummary([`origin/${branch}`]);

  return diffSummary.changed > 0;
}
