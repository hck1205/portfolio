import {
  createElement as createLucideElement
} from "lucide";
import type { IconNode } from "lucide";

import {
  ICON_GRID_ESTIMATED_COLUMNS,
  ICON_TILE_ESTIMATED_HEIGHT
} from "./iconCatalog.constants";
import type { IconEntry, IconSectionElements } from "./iconCatalog.types";

/**
 * Creates an HTML element and applies the common fields used by the icon
 * catalog builders.
 *
 * @param tag HTML tag name to create.
 * @param options Optional class name and text content for the created element.
 * @returns Created HTML element with the requested attributes applied.
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    className?: string;
    textContent?: string;
  } = {}
) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }

  return element;
}

/**
 * Converts a Lucide icon node into the SVG element shown in Storybook.
 *
 * @param icon Lucide icon node to render.
 * @returns SVG element styled for the icon catalog grid.
 */
export function createIconSvg(icon: IconNode) {
  const svg = createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 28,
    width: 28,
    "stroke-width": 2
  });

  svg.classList.add("ds-icon-catalog__svg");

  return svg;
}

/**
 * Creates one compact icon tile containing the SVG preview and icon name.
 *
 * @param icon Lucide icon metadata used by the catalog.
 * @returns Tile element ready to be appended to an icon group grid.
 */
export function createIconTile(icon: IconEntry) {
  const tile = createElement("article", { className: "ds-icon-tile" });

  tile.append(
    createIconSvg(icon.node),
    createElement("span", { textContent: icon.name })
  );

  return tile;
}

/**
 * Creates the visible shell for one alphabet group before its icons are
 * lazily rendered.
 *
 * @param group Alphabet group title to render.
 * @param iconCount Number of icons in the group.
 * @returns Section, grid, and sentinel elements for lazy rendering.
 */
export function createIconSection(
  group: string,
  iconCount: number
): IconSectionElements {
  const section = createElement("section", { className: "ds-icon-section" });
  const header = createElement("div", { className: "ds-icon-section__header" });
  const grid = createElement("div", { className: "ds-icon-grid" });
  const sentinel = createElement("div", { className: "ds-icon-section__sentinel" });
  const estimatedRows = Math.max(1, Math.ceil(iconCount / ICON_GRID_ESTIMATED_COLUMNS));

  section.style.minHeight = `${estimatedRows * ICON_TILE_ESTIMATED_HEIGHT}px`;

  header.append(
    createElement("h2", { textContent: group }),
    createElement("span", { textContent: `${iconCount} icons` })
  );

  section.append(header, grid, sentinel);

  return {
    grid,
    section,
    sentinel
  };
}
