/**
 * -------------------------
 * TEMPLATE DIFF ENGINE
 * -------------------------
 */

import type { Label } from '../../domain/label.js';
import type { GitHubLabel } from '../../github/request/github-request.wrapper.js';

/**
 * -------------------------
 * LABEL COMPARISON MODEL
 * -------------------------
 */
export type LabelComparison = {
  toCreate: Label[];
  toUpdate: { current: GitHubLabel; next: Label }[];
  toDelete: GitHubLabel[];
  toIgnore: Label[];
};

/**
 * -------------------------
 * NORMALIZATION UTILS
 * -------------------------
 */
const normalizeKey = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');

/**
 * -------------------------
 * GITHUB NORMALIZATION
 * -------------------------
 * Converts GitHub API labels into internal normalized format.
 */
function normalizeGitHub(labels: GitHubLabel[]): Label[] {
  return labels.map((l) => ({
    name: normalizeKey(l.name),
    color: l.color,
    description: l.description ?? '',
  }));
}

/**
 * -------------------------
 * TEMPLATE DIFF CALCULATION
 * -------------------------
 * Compares template labels with GitHub labels and produces:
 * - toCreate
 * - toUpdate
 * - toDelete
 * - toIgnore
 */
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
  const toUpdate: { current: GitHubLabel; next: Label }[] = [];
  const toIgnore: Label[] = [];
  const toDelete: GitHubLabel[] = [];

  /**
   * GLOBAL GUARD
   * → prevents duplicate creation when diff state is inconsistent
   */
  const used = new Set<string>(remote.map((r) => r.name));

  /**
   * COMPARE TEMPLATE -> REMOTE
   */
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

  /**
   * DETECT REMOTE EXTRA LABELS
   */
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