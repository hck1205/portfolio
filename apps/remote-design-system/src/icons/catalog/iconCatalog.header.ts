import { createElement } from "./iconCatalog.dom";

export type IconCatalogHeaderElements = {
  header: HTMLElement;
  searchInput: HTMLInputElement;
  statusElement: HTMLElement;
};

export function createIconCatalogHeader(options: {
  group?: string;
  iconCount: number;
  search: string;
}): IconCatalogHeaderElements {
  const header = createElement("header", { className: "ds-icon-catalog__header" });
  const searchField = createElement("label", { className: "ds-icon-catalog__search" });
  const searchLabel = createElement("span", { textContent: "Search icons" });
  const searchInput = document.createElement("input");
  const statusElement = createElement("span", { className: "ds-icon-catalog__status" });

  searchInput.type = "search";
  searchInput.value = options.search;
  searchInput.placeholder = "Search icon name";
  searchInput.autocomplete = "off";
  searchField.append(searchLabel, searchInput);

  header.append(
    createElement("p", { textContent: "Icons" }),
    createElement("h1", {
      textContent: options.group ? `Lucide icons: ${options.group}` : "Lucide icons"
    }),
    createElement("span", {
      textContent: `${options.iconCount} Lucide icons from the package icon registry`
    }),
    searchField,
    statusElement
  );

  return {
    header,
    searchInput,
    statusElement
  };
}
