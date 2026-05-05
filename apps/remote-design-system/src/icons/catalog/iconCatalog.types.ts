import type { IconNode } from "lucide";

export type IconCatalogArgs = {
  group?: string;
  search?: string;
};

export type IconEntry = {
  group: string;
  label: string;
  name: string;
  node: IconNode;
};

export type IconSectionElements = {
  grid: HTMLElement;
  section: HTMLElement;
  sentinel: HTMLElement;
};
