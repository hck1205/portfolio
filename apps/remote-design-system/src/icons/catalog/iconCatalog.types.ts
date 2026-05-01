import type { IconNode } from "lucide";

export type IconCatalogArgs = {
  group?: string;
};

export type IconEntry = {
  group: string;
  name: string;
  node: IconNode;
};

export type IconSectionElements = {
  grid: HTMLElement;
  section: HTMLElement;
  sentinel: HTMLElement;
};
