import type {
  TreeSelectNode,
  TreeSelectPlacement,
  TreeSelectSize,
  TreeSelectStatus,
  TreeSelectVariant
} from "../types/TreeSelect.types";

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value !== "false";
}

export function getTreeSelectPlacement(element: HTMLElement): TreeSelectPlacement {
  const value = element.getAttribute("placement");

  if (value === "bottomRight" || value === "topLeft" || value === "topRight") {
    return value;
  }

  return "bottomLeft";
}

export function getTreeSelectSize(element: HTMLElement): TreeSelectSize {
  const value = element.getAttribute("size");

  return value === "small" || value === "large" ? value : "medium";
}

export function getTreeSelectStatus(element: HTMLElement): TreeSelectStatus | undefined {
  const value = element.getAttribute("status");

  return value === "error" || value === "warning" ? value : undefined;
}

export function getTreeSelectVariant(element: HTMLElement): TreeSelectVariant {
  const value = element.getAttribute("variant");

  if (value === "filled" || value === "borderless" || value === "underlined") {
    return value;
  }

  return "outlined";
}

export function parseTreeData(value: string | null): TreeSelectNode[] {
  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value) as unknown;

    return Array.isArray(parsedValue) ? normalizeTreeNodes(parsedValue) : [];
  } catch {
    return [];
  }
}

export function parseValueList(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatValueList(values: Iterable<string>) {
  return Array.from(values).join(",");
}

export function flattenTree(nodes: TreeSelectNode[], depth = 0): Array<TreeSelectNode & { depth: number }> {
  return nodes.flatMap((node) => [
    { ...node, depth },
    ...flattenTree(node.children ?? [], depth + 1)
  ]);
}

export function filterTree(nodes: TreeSelectNode[], query: string): TreeSelectNode[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return nodes;
  }

  const filteredNodes: TreeSelectNode[] = [];

  nodes.forEach((node) => {
      const children = filterTree(node.children ?? [], query);
      const matches = `${node.label} ${node.value}`.toLowerCase().includes(normalizedQuery);

      if (matches || children.length > 0) {
        filteredNodes.push({ ...node, children });
      }
    });

  return filteredNodes;
}

export function getSelectedLabels(nodes: TreeSelectNode[], values: string[]) {
  const valueSet = new Set(values);

  return flattenTree(nodes)
    .filter((node) => valueSet.has(node.value))
    .map((node) => node.label);
}

function normalizeTreeNodes(nodes: unknown[]): TreeSelectNode[] {
  const treeNodes: TreeSelectNode[] = [];

  nodes.forEach((node) => {
      if (!node || typeof node !== "object") {
        return;
      }

      const record = node as Record<string, unknown>;
      const value = String(record.value ?? "");
      const label = String(record.label ?? record.title ?? value);

      if (!value || !label) {
        return;
      }

      treeNodes.push({
        children: Array.isArray(record.children) ? normalizeTreeNodes(record.children) : undefined,
        disabled: Boolean(record.disabled),
        label,
        value
      });
    });

  return treeNodes;
}
