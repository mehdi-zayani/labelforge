import type { Label } from '../../domain/label.js';
import type { GitHubLabel } from '../../github/api/labels.api.js';
import type { LabelComparison } from '../../domain/label-compare.js';

const normalizeKey = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');

function normalizeGitHub(labels: GitHubLabel[]): Label[] {
  return labels.map((l) => ({
    name: normalizeKey(l.name),
    color: l.color,
    description: l.description ?? '',
  }));
}

export function diffTemplate(
  templateLabels: Label[],
  githubLabels: GitHubLabel[]
): LabelComparison {
  const remote = normalizeGitHub(githubLabels);

  const remoteMap = new Map(remote.map((l) => [l.name, l]));

  const templateMap = new Map(
    templateLabels.map((l) => [normalizeKey(l.name), l])
  );

  const toCreate: Label[] = [];
  const toUpdate: { current: Label; next: Label }[] = [];
  const toIgnore: Label[] = [];
  const toDelete: Label[] = [];

  /**
   * GLOBAL GUARD (IMPORTANT FIX)
   * → évite les CREATE déjà existants même si diff bug
   */
  const used = new Set<string>(remote.map((r) => r.name));

  for (const tpl of templateLabels) {
    const key = normalizeKey(tpl.name);

    const existing = remoteMap.get(key);

    if (!existing) {
      if (used.has(key)) continue;

      used.add(key);

      toCreate.push({
        ...tpl,
        name: key,
      });

      continue;
    }

    const isDifferent =
      tpl.color !== existing.color ||
      (tpl.description ?? '') !== (existing.description ?? '');

    if (isDifferent) {
      toUpdate.push({
        current: existing,
        next: {
          ...tpl,
          name: key,
        },
      });
    } else {
      toIgnore.push(tpl);
    }
  }

  for (const r of remote) {
    if (!templateMap.has(r.name)) {
      toDelete.push(r);
    }
  }

  return {
    toCreate,
    toUpdate,
    toDelete,
    toIgnore,
  };
}
