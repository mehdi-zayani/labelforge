export function diffTemplate(templateLabels: any[], githubLabels: any[]) {
  const toCreate = [];
  const toUpdate = [];
  const toIgnore = [];

  const githubMap = new Map(githubLabels.map(l => [l.name, l]));

  for (const tpl of templateLabels) {
    const existing = githubMap.get(tpl.name);

    if (!existing) {
      toCreate.push(tpl);
    } else {
      const isDifferent =
        tpl.color !== existing.color ||
        tpl.description !== (existing.description ?? "");

      if (isDifferent) {
        toUpdate.push({ current: existing, next: tpl });
      } else {
        toIgnore.push(tpl);
      }
    }
  }

  return { toCreate, toUpdate, toIgnore };
}