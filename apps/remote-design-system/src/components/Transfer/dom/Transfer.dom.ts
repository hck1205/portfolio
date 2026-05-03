import type { TransferItem, TransferStatus } from "../types/Transfer.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getTransferStatus(element: HTMLElement): TransferStatus | undefined {
  const value = element.getAttribute("status");

  return value === "error" || value === "warning" ? value : undefined;
}

export function parseKeyList(value: string | null) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean)
  );
}

export function formatKeyList(keys: Iterable<string>) {
  return Array.from(keys).join(",");
}

export function parseTransferItems(value: string | null): TransferItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value) as Array<Partial<TransferItem>>;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((item) => ({
        description: item.description ?? "",
        disabled: Boolean(item.disabled),
        key: String(item.key ?? ""),
        title: String(item.title ?? item.key ?? "")
      }))
      .filter((item) => item.key && item.title);
  } catch {
    return [];
  }
}

export function parseTransferTitles(value: string | null) {
  const [left = "Source", right = "Target"] = (value ?? "").split(",").map((title) => title.trim());

  return [left || "Source", right || "Target"] as const;
}

export function filterTransferItems(items: TransferItem[], searchValue: string) {
  const query = searchValue.trim().toLowerCase();

  if (!query) {
    return items;
  }

  return items.filter((item) => {
    return `${item.title} ${item.description ?? ""}`.toLowerCase().includes(query);
  });
}
