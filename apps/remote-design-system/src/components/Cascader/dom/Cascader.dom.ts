import type {
  CascaderExpandTrigger,
  CascaderOption,
  CascaderPath,
  CascaderPlacement,
  CascaderSelectedItem,
  CascaderSize,
  CascaderStatus,
  CascaderVariant
} from "../types/Cascader.types";

const EXPAND_TRIGGERS = ["click", "hover"] as const;
const PLACEMENTS = ["bottomLeft", "bottomRight", "topLeft", "topRight"] as const;
const SIZES = ["small", "medium", "large"] as const;
const STATUSES = ["error", "warning"] as const;
const VARIANTS = ["outlined", "borderless", "filled", "underlined"] as const;

let cascaderId = 0;

export function createCascaderId(part: string) {
  cascaderId += 1;

  return `ds-cascader-${part}-${cascaderId}`;
}

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);

  return value === "" || value === name || value === "true";
}

export function getCascaderExpandTrigger(element: HTMLElement): CascaderExpandTrigger {
  const value = element.getAttribute("expand-trigger");

  return isOneOf(value, EXPAND_TRIGGERS) ? value : "click";
}

export function getCascaderPlacement(element: HTMLElement): CascaderPlacement {
  const value = element.getAttribute("placement");

  return isOneOf(value, PLACEMENTS) ? value : "bottomLeft";
}

export function getCascaderSize(element: HTMLElement): CascaderSize {
  const value = element.getAttribute("size");

  return isOneOf(value, SIZES) ? value : "medium";
}

export function getCascaderStatus(element: HTMLElement): CascaderStatus | undefined {
  const value = element.getAttribute("status");

  return isOneOf(value, STATUSES) ? value : undefined;
}

export function getCascaderVariant(element: HTMLElement): CascaderVariant {
  const value = element.getAttribute("variant");

  return isOneOf(value, VARIANTS) ? value : "outlined";
}

export function parseOptions(value: string): CascaderOption[] {
  if (!value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return Array.isArray(parsed) ? parsed.flatMap(normalizeOption) : [];
  } catch {
    return [];
  }
}

export function parseValue(value: string, multiple: boolean): CascaderPath[] {
  if (!value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (multiple && Array.isArray(parsed)) {
      return parsed.every((item) => Array.isArray(item))
        ? parsed.map((item) => item.map(String))
        : [parsed.map(String)];
    }

    if (Array.isArray(parsed)) {
      return [parsed.map(String)];
    }
  } catch {
    return [value.split("/").filter(Boolean)];
  }

  return [];
}

export function stringifyValue(paths: CascaderPath[], multiple: boolean) {
  if (!paths.length) {
    return "";
  }

  return JSON.stringify(multiple ? paths : paths[0]);
}

export function pathToKey(path: CascaderPath) {
  return path.map((value) => encodeURIComponent(value)).join("/");
}

export function pathFromKey(key: string) {
  if (!key) {
    return [];
  }

  return key.split("/").map((value) => decodeURIComponent(value));
}

export function getPathOptions(options: CascaderOption[], path: CascaderPath) {
  const selectedOptions: CascaderOption[] = [];
  let currentOptions = options;

  for (const value of path) {
    const option = currentOptions.find((item) => item.value === value);

    if (!option) {
      break;
    }

    selectedOptions.push(option);
    currentOptions = option.children ?? [];
  }

  return selectedOptions;
}

export function getPathDisplayLabel(options: CascaderOption[], path: CascaderPath, multiple: boolean) {
  const labels = getPathOptions(options, path).map((option) => option.label ?? option.value);

  return multiple ? labels.at(-1) ?? "" : labels.join(" / ");
}

export function getSelectedItems(
  paths: CascaderPath[],
  options: CascaderOption[],
  multiple: boolean
): CascaderSelectedItem[] {
  return paths.map((path) => {
    return {
      label: getPathDisplayLabel(options, path, multiple),
      path
    };
  });
}

export function removePathByKey(paths: CascaderPath[], pathKey: string) {
  return paths.filter((path) => pathToKey(path) !== pathKey);
}

export function getColumns(options: CascaderOption[], activePath: CascaderPath) {
  const columns: CascaderOption[][] = [options];
  let currentOptions = options;

  for (const value of activePath) {
    const option = currentOptions.find((item) => item.value === value);

    if (!option?.children?.length) {
      break;
    }

    currentOptions = option.children;
    columns.push(currentOptions);
  }

  return columns;
}

export function hasChildren(option: CascaderOption | undefined) {
  return Boolean(option?.children?.length) || option?.isLeaf === false;
}

export function isSamePath(left: CascaderPath, right: CascaderPath) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function togglePathSelection(paths: CascaderPath[], path: CascaderPath) {
  const hasPath = paths.some((selectedPath) => isSamePath(selectedPath, path));

  return hasPath ? paths.filter((selectedPath) => !isSamePath(selectedPath, path)) : [...paths, path];
}

export function findSearchMatches(options: CascaderOption[], keyword: string) {
  const query = normalizeSearchText(keyword);
  const matches: Array<{ labels: string[]; path: CascaderPath }> = [];

  if (!query) {
    return matches;
  }

  visitOptions(options, [], [], (path, labels) => {
    if (normalizeSearchText(labels.join(" / ")).includes(query)) {
      matches.push({ labels, path });
    }
  });

  return matches;
}

function visitOptions(
  options: CascaderOption[],
  path: CascaderPath,
  labels: string[],
  callback: (path: CascaderPath, labels: string[]) => void
) {
  for (const option of options) {
    const nextPath = [...path, option.value];
    const nextLabels = [...labels, option.label ?? option.value];

    callback(nextPath, nextLabels);

    if (option.children?.length) {
      visitOptions(option.children, nextPath, nextLabels, callback);
    }
  }
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase();
}

function normalizeOption(item: unknown): CascaderOption[] {
  if (!item || typeof item !== "object") {
    return [];
  }

  const option = item as Partial<CascaderOption>;
  const value = String(option.value ?? "");

  if (!value) {
    return [];
  }

  return [
    {
      children: Array.isArray(option.children) ? option.children.flatMap(normalizeOption) : undefined,
      disabled: Boolean(option.disabled),
      isLeaf: option.isLeaf,
      label: option.label === undefined ? undefined : String(option.label),
      value
    }
  ];
}

function isOneOf<T extends readonly string[]>(value: string | null, options: T): value is T[number] {
  return value !== null && options.includes(value);
}
