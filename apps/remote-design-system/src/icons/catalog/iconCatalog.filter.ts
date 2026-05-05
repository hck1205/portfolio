import type { IconEntry } from "./iconCatalog.types";

export function getVisibleIconGroups(selectedGroup: string | undefined, iconGroups: string[]) {
  return selectedGroup ? [selectedGroup] : iconGroups;
}

export function getVisibleIconEntries(selectedGroup: string | undefined, iconEntries: IconEntry[]) {
  return selectedGroup
    ? iconEntries.filter((icon) => icon.group === selectedGroup)
    : iconEntries;
}

export function filterIconEntries(iconEntries: IconEntry[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return iconEntries;
  }

  return iconEntries.filter((icon) =>
    icon.label.includes(normalizedQuery) ||
    icon.name.toLowerCase().includes(normalizedQuery)
  );
}

export function groupIconEntries(iconEntries: IconEntry[], visibleGroups: string[]) {
  const entriesByGroup = new Map<string, IconEntry[]>();

  for (const icon of iconEntries) {
    const entries = entriesByGroup.get(icon.group) ?? [];

    entries.push(icon);
    entriesByGroup.set(icon.group, entries);
  }

  return visibleGroups
    .map((group) => [group, entriesByGroup.get(group) ?? []] as const)
    .filter(([, entries]) => entries.length > 0);
}
