import { DESCRIPTIONS_ITEM_STYLES, DESCRIPTIONS_STYLES } from "./Descriptions.styles";

let descriptionsStyleSheet: CSSStyleSheet | undefined;
let descriptionsItemStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getStyleSheet(styleText: string, currentSheet: CSSStyleSheet | undefined) {
  if (currentSheet) {
    return currentSheet;
  }

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(styleText);

  return styleSheet;
}

function applyStyles(shadowRoot: ShadowRoot, styleText: string, styleKey: string, styleSheet: CSSStyleSheet) {
  if (canAdoptStyleSheets()) {
    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector(`style[data-${styleKey}]`)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.setAttribute(`data-${styleKey}`, "");
  styleElement.textContent = styleText;
  shadowRoot.prepend(styleElement);
}

export function applyDescriptionsStyles(shadowRoot: ShadowRoot) {
  descriptionsStyleSheet = getStyleSheet(DESCRIPTIONS_STYLES, descriptionsStyleSheet);
  applyStyles(shadowRoot, DESCRIPTIONS_STYLES, "ds-descriptions", descriptionsStyleSheet);
}

export function applyDescriptionsItemStyles(shadowRoot: ShadowRoot) {
  descriptionsItemStyleSheet = getStyleSheet(DESCRIPTIONS_ITEM_STYLES, descriptionsItemStyleSheet);
  applyStyles(shadowRoot, DESCRIPTIONS_ITEM_STYLES, "ds-descriptions-item", descriptionsItemStyleSheet);
}
