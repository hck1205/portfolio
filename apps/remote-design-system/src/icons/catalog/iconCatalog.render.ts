import { allIconEntries, iconGroups } from "./iconCatalog.data";
import { createElement, createIconSection } from "./iconCatalog.dom";
import { filterIconEntries, getVisibleIconEntries, getVisibleIconGroups, groupIconEntries } from "./iconCatalog.filter";
import { createIconCatalogHeader } from "./iconCatalog.header";
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
export function renderIconCatalog({ group, search = "" }: IconCatalogArgs = {}) {
  const container = createElement("div", { className: "ds-icon-catalog" });
  const sections = createElement("div", { className: "ds-icon-sections" });
  const emptyElement = createElement("p", {
    className: "ds-icon-catalog__empty",
    textContent: "No icons found."
  });
  let cleanupLazySections: (() => void) | undefined;
  let searchFrame = 0;
  const visibleGroups = getVisibleIconGroups(group, iconGroups);
  const baseIcons = getVisibleIconEntries(group, allIconEntries);
  const { header, searchInput, statusElement } = createIconCatalogHeader({
    group,
    iconCount: baseIcons.length,
    search
  });

  const renderSections = (query: string) => {
    cleanupLazySections?.();
    sections.replaceChildren();

    const groupedEntries = groupIconEntries(
      filterIconEntries(baseIcons, query),
      visibleGroups
    );
    const entriesByGroup = new Map<string, IconEntry[]>();
    const sectionElementsByGroup = new Map<string, HTMLElement>();
    const gridsByGroup = new Map<string, HTMLElement>();
    const sentinelsByGroup = new Map<string, HTMLElement>();

    if (groupedEntries.length === 0) {
      statusElement.textContent = `0 of ${baseIcons.length} icons matched`;
      sections.append(emptyElement);
      return;
    }

    for (const [iconGroup, entries] of groupedEntries) {
      const { grid, section, sentinel } = createIconSection(iconGroup, entries.length);

      entriesByGroup.set(iconGroup, entries);
      sectionElementsByGroup.set(iconGroup, section);
      gridsByGroup.set(iconGroup, grid);
      sentinelsByGroup.set(iconGroup, sentinel);
      sections.append(section);
    }

    cleanupLazySections = mountLazyIconSections(
      container,
      entriesByGroup,
      sectionElementsByGroup,
      gridsByGroup,
      sentinelsByGroup,
      statusElement
    );
  };

  searchInput.addEventListener("input", () => {
    window.cancelAnimationFrame(searchFrame);
    searchFrame = window.requestAnimationFrame(() => {
      renderSections(searchInput.value);
    });
  });

  container.append(header, sections);
  renderSections(search);

  return container;
}
