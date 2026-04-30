import { allIconEntries, iconGroups } from "./iconCatalog.data";
import { createElement, createIconSection } from "./iconCatalog.dom";
import { mountLazyIconSections } from "./iconCatalog.lazy";
import type { IconCatalogArgs, IconEntry } from "./iconCatalog.types";

/**
 * Builds the full Lucide icon catalog view for Storybook.
 *
 * The story can render every alphabet group or a single selected group. The
 * section shells are created immediately, while SVG tiles are delegated to the
 * lazy renderer.
 *
 * @param args Storybook controls that select the visible icon group.
 * @returns Icon catalog root element for the Storybook canvas.
 */
export function renderIconCatalog({ group }: IconCatalogArgs = {}) {
  const container = createElement("div", { className: "ds-icon-catalog" });
  const header = createElement("header", { className: "ds-icon-catalog__header" });
  const sections = createElement("div", { className: "ds-icon-sections" });
  const entriesByGroup = new Map<string, IconEntry[]>();
  const sectionElementsByGroup = new Map<string, HTMLElement>();
  const gridsByGroup = new Map<string, HTMLElement>();
  const sentinelsByGroup = new Map<string, HTMLElement>();
  const statusElement = createElement("span", { className: "ds-icon-catalog__status" });
  const visibleGroups = group ? [group] : iconGroups;
  const visibleIcons = group
    ? allIconEntries.filter((icon) => icon.group === group)
    : allIconEntries;

  header.append(
    createElement("p", { textContent: "Icons" }),
    createElement("h1", {
      textContent: group ? `Lucide icons: ${group}` : "Lucide icons"
    }),
    createElement("span", {
      textContent: `${visibleIcons.length} Lucide icons from the package icon registry`
    }),
    statusElement
  );

  for (const iconGroup of visibleGroups) {
    const entries = allIconEntries.filter((icon) => icon.group === iconGroup);
    const { grid, section, sentinel } = createIconSection(iconGroup, entries.length);

    entriesByGroup.set(iconGroup, entries);
    sectionElementsByGroup.set(iconGroup, section);
    gridsByGroup.set(iconGroup, grid);
    sentinelsByGroup.set(iconGroup, sentinel);
    sections.append(section);
  }

  container.append(header, sections);
  mountLazyIconSections(
    container,
    entriesByGroup,
    sectionElementsByGroup,
    gridsByGroup,
    sentinelsByGroup,
    statusElement
  );

  return container;
}
