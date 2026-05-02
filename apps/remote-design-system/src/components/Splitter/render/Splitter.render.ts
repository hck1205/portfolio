import { SPLITTER_PANEL_STYLES } from "../Splitter.styles";

let splitterPanelStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function createStyleSheet(styles: string) {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(styles);

  return styleSheet;
}

function getPanelStyleSheet() {
  splitterPanelStyleSheet ??= createStyleSheet(SPLITTER_PANEL_STYLES);
  return splitterPanelStyleSheet;
}

export function applySplitterPanelStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getPanelStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  const dataAttribute = "data-ds-splitter-panel";

  if (shadowRoot.querySelector(`style[${dataAttribute}]`)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.setAttribute(dataAttribute, "");
  styleElement.textContent = SPLITTER_PANEL_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createSplitterPanelElements() {
  const rootElement = document.createElement("div");
  const slotElement = document.createElement("slot");

  rootElement.className = "ds-splitter-panel";
  rootElement.append(slotElement);

  return { rootElement, slotElement };
}

export function createSplitterDragger(index: number) {
  const dragger = document.createElement("button");

  dragger.type = "button";
  dragger.className = "ds-splitter__dragger";
  dragger.dataset.splitterDragger = String(index);
  dragger.setAttribute("aria-label", `Resize panel ${index + 1}`);

  return dragger;
}
