export type ResultElements = {
  iconElement: HTMLDivElement;
  rootElement: HTMLElement;
  subTitleElement: HTMLParagraphElement;
  titleElement: HTMLHeadingElement;
};

export function createResultElements(): ResultElements {
  const rootElement = createPartElement("section", "ds-result", "root");
  const iconElement = createPartElement("div", "ds-result__icon", "icon");
  const copyElement = document.createElement("div");
  const titleElement = createPartElement("h2", "ds-result__title", "title");
  const subTitleElement = createPartElement("p", "ds-result__subtitle", "sub-title");
  const extraElement = createPartElement("slot", "ds-result__extra", "extra");

  copyElement.className = "ds-result__copy";
  extraElement.name = "extra";
  copyElement.append(titleElement, subTitleElement);
  rootElement.append(iconElement, copyElement, extraElement);

  return {
    iconElement,
    rootElement,
    subTitleElement,
    titleElement
  };
}

function createPartElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string,
  partName: string
) {
  const element = document.createElement(tagName);

  element.className = className;
  element.setAttribute("part", partName);

  return element;
}
