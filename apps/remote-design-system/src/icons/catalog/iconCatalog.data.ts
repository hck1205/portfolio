import { icons as lucideIcons } from "lucide";

import type { IconEntry } from "./iconCatalog.types";

function formatLucideIconName(name: string) {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

export const allIconEntries = Object.entries(lucideIcons)
  .filter(([name]) => /^[A-Z]/.test(name))
  .map(([name, node]) => {
    const label = formatLucideIconName(name);

    return {
      group: label[0]?.toUpperCase() ?? "#",
      label,
      name,
      node
    };
  })
  .sort((left, right) => left.label.localeCompare(right.label)) satisfies IconEntry[];

export const iconGroups = Array.from(
  new Set(allIconEntries.map((icon) => icon.group))
).sort();
