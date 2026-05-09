import type { IconNode } from "lucide";

import { allIconEntries } from "../../../icons/catalog/iconCatalog.data";

const iconNodeByName = new Map<string, IconNode>();

for (const entry of allIconEntries) {
  iconNodeByName.set(entry.name, entry.node);
  iconNodeByName.set(entry.name.toLowerCase(), entry.node);
  iconNodeByName.set(entry.label, entry.node);
}

export function getIconNode(name: string) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return undefined;
  }

  return iconNodeByName.get(normalizedName) ?? iconNodeByName.get(normalizedName.toLowerCase());
}
