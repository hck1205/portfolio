import type { DsMenuItem } from "../MenuItem";

export function getNextMenuItem(items: DsMenuItem[], direction: 1 | -1) {
  if (!items.length) {
    return undefined;
  }

  const activeIndex = items.findIndex((item) => item.shadowRoot?.activeElement);
  const nextIndex = activeIndex === -1 ? 0 : (activeIndex + direction + items.length) % items.length;

  return items[nextIndex];
}
