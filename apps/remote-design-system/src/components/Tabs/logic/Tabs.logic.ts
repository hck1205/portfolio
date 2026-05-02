import type { TabItemData } from "../types/Tabs.types";

export function getDefaultActiveKey(items: TabItemData[], requestedKey: string) {
  if (requestedKey && items.some((item) => item.key === requestedKey && !item.disabled)) {
    return requestedKey;
  }

  return items.find((item) => !item.disabled)?.key ?? items[0]?.key ?? "";
}

export function getNextEnabledTabKey(items: TabItemData[], activeKey: string, offset: number) {
  const enabledItems = items.filter((item) => !item.disabled);

  if (enabledItems.length === 0) {
    return "";
  }

  const currentIndex = Math.max(
    enabledItems.findIndex((item) => item.key === activeKey),
    0
  );
  const nextIndex = (currentIndex + offset + enabledItems.length) % enabledItems.length;

  return enabledItems[nextIndex]?.key ?? "";
}

export function getEdgeEnabledTabKey(items: TabItemData[], edge: "first" | "last") {
  const enabledItems = items.filter((item) => !item.disabled);

  return edge === "first" ? enabledItems[0]?.key ?? "" : enabledItems.at(-1)?.key ?? "";
}

export function getKeyboardNavigationTabKey(
  items: TabItemData[],
  activeKey: string,
  eventKey: string,
  orientation: "horizontal" | "vertical"
) {
  if (eventKey === "Home") {
    return getEdgeEnabledTabKey(items, "first");
  }

  if (eventKey === "End") {
    return getEdgeEnabledTabKey(items, "last");
  }

  const isForwardKey =
    (orientation === "horizontal" && eventKey === "ArrowRight") ||
    (orientation === "vertical" && eventKey === "ArrowDown");
  const isBackwardKey =
    (orientation === "horizontal" && eventKey === "ArrowLeft") ||
    (orientation === "vertical" && eventKey === "ArrowUp");

  if (isForwardKey) {
    return getNextEnabledTabKey(items, activeKey, 1);
  }

  if (isBackwardKey) {
    return getNextEnabledTabKey(items, activeKey, -1);
  }

  return "";
}

export function getActiveKeyAfterTabRemove(items: TabItemData[], removedKey: string, activeKey: string) {
  if (removedKey !== activeKey) {
    return getDefaultActiveKey(
      items.filter((item) => item.key !== removedKey),
      activeKey
    );
  }

  const removedIndex = items.findIndex((item) => item.key === removedKey);
  const remainingItems = items.filter((item) => item.key !== removedKey);
  const nextItem = remainingItems[Math.min(removedIndex, remainingItems.length - 1)] ?? remainingItems.at(-1);

  return getDefaultActiveKey(remainingItems, nextItem?.key ?? "");
}
