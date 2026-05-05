export type SkeletonElements = {
  avatarElement: HTMLDivElement;
  contentSlotElement: HTMLSlotElement;
  paragraphElement: HTMLDivElement;
  placeholderElement: HTMLDivElement;
  rootElement: HTMLDivElement;
  titleElement: HTMLDivElement;
};

export function createSkeletonElements(): SkeletonElements {
  const rootElement = createPartElement("div", "ds-skeleton", "root");
  const placeholderElement = createPartElement("div", "ds-skeleton__placeholder", "placeholder");
  const avatarElement = createPartElement("div", "ds-skeleton__avatar", "avatar");
  const bodyElement = document.createElement("div");
  const titleElement = createPartElement("div", "ds-skeleton__title", "title");
  const paragraphElement = createPartElement("div", "ds-skeleton__paragraph", "paragraph");
  const contentSlotElement = createPartElement("slot", "ds-skeleton__content", "content");

  bodyElement.className = "ds-skeleton__body";
  placeholderElement.setAttribute("aria-hidden", "true");
  bodyElement.append(titleElement, paragraphElement);
  placeholderElement.append(avatarElement, bodyElement);
  rootElement.append(placeholderElement, contentSlotElement);

  return {
    avatarElement,
    contentSlotElement,
    paragraphElement,
    placeholderElement,
    rootElement,
    titleElement
  };
}

export function createSkeletonLine() {
  const row = document.createElement("span");

  row.className = "ds-skeleton__line";
  row.setAttribute("part", "line");

  return row;
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
