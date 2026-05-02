import { TABS_STYLES } from "../Tabs.styles";

let tabsStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getTabsStyleSheet() {
  if (!tabsStyleSheet) {
    tabsStyleSheet = new CSSStyleSheet();
    tabsStyleSheet.replaceSync(TABS_STYLES);
  }

  return tabsStyleSheet;
}

export function applyTabsStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getTabsStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-tabs]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsTabs = "";
  styleElement.textContent = TABS_STYLES;
  shadowRoot.prepend(styleElement);
}
