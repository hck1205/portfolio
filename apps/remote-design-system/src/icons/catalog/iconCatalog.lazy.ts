import { ICON_SECTION_RENDER_MARGIN } from "./iconCatalog.constants";
import { createIconTile } from "./iconCatalog.dom";
import type { IconEntry } from "./iconCatalog.types";

/**
 * Lazily renders icon groups when each alphabet section enters the viewport.
 *
 * The catalog can contain more than a thousand SVGs, so this function keeps the
 * initial DOM light and creates each group only when its section is near the
 * visible area.
 *
 * @param containerElement Icon catalog root element.
 * @param entriesByGroup Icon entries keyed by alphabet group.
 * @param sectionElementsByGroup Section elements keyed by alphabet group.
 * @param gridsByGroup Tile grid elements keyed by alphabet group.
 * @param sentinelsByGroup Lazy rendering sentinel elements keyed by group.
 * @param statusElement Element that reports the current rendered icon count.
 */
export function mountLazyIconSections(
  containerElement: HTMLElement,
  entriesByGroup: Map<string, IconEntry[]>,
  sectionElementsByGroup: Map<string, HTMLElement>,
  gridsByGroup: Map<string, HTMLElement>,
  sentinelsByGroup: Map<string, HTMLElement>,
  statusElement: HTMLElement,
) {
  const totalIconCount = Array.from(entriesByGroup.values()).reduce(
    (total, entries) => total + entries.length,
    0
  );
  let renderedIconCount = 0;
  const renderedGroups = new Set<string>();
  const scrollListenerController = new AbortController();

  /**
   * Updates the status text shown in the catalog header.
   */
  const updateStatus = () => {
    statusElement.textContent = `${renderedIconCount} of ${totalIconCount} icons rendered`;
  };

  /**
   * Renders every icon tile for one alphabet group.
   *
   * @param group Alphabet group to render.
   */
  const renderGroup = (group: string) => {
    if (renderedGroups.has(group)) {
      return;
    }

    const entries = entriesByGroup.get(group) ?? [];
    const grid = gridsByGroup.get(group);

    if (!grid) {
      return;
    }

    for (const icon of entries) {
      grid.append(createIconTile(icon));
    }

    sectionElementsByGroup.get(group)?.style.removeProperty("min-height");
    renderedGroups.add(group);
    renderedIconCount += entries.length;
    sentinelsByGroup.get(group)?.remove();
    updateStatus();

    if (renderedGroups.size >= entriesByGroup.size) {
      scrollListenerController.abort();
    }
  };

  /**
   * Fallback viewport check for environments where scroll events fire before
   * IntersectionObserver callbacks are delivered.
   */
  const renderGroupsNearViewport = () => {
    for (const [group, section] of sectionElementsByGroup.entries()) {
      if (renderedGroups.has(group)) {
        continue;
      }

      const sectionRect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      if (
        sectionRect.top <= viewportHeight + ICON_SECTION_RENDER_MARGIN &&
        sectionRect.bottom >= -ICON_SECTION_RENDER_MARGIN
      ) {
        renderGroup(group);
      }
    }
  };

  updateStatus();
  window.setTimeout(renderGroupsNearViewport, 0);
  window.addEventListener("scroll", renderGroupsNearViewport, {
    passive: true,
    signal: scrollListenerController.signal
  });
  containerElement.addEventListener("scroll", renderGroupsNearViewport, {
    passive: true,
    signal: scrollListenerController.signal
  });

  if (typeof IntersectionObserver === "undefined") {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      const group = (entry.target as HTMLElement).dataset.iconGroup;

      if (group) {
        renderGroup(group);
      }
    }
  }, {
    rootMargin: `${ICON_SECTION_RENDER_MARGIN}px`
  });

  for (const [group, sentinel] of sentinelsByGroup.entries()) {
    sentinel.dataset.iconGroup = group;
    observer.observe(sentinel);
  }
}
