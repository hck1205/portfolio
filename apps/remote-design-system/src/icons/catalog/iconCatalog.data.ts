import { icons as lucideIcons } from "lucide";

import type { IconEntry } from "./iconCatalog.types";

export const allIconEntries = Object.entries(lucideIcons)
  .filter(([name]) => /^[A-Z]/.test(name))
  .map(([name, node]) => ({
    group: name[0] ?? "#",
    name,
    node
  }))
  .sort((left, right) => left.name.localeCompare(right.name)) satisfies IconEntry[];

export const iconGroups = Array.from(
  new Set(allIconEntries.map((icon) => icon.group))
).sort();
