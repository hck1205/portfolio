export const ICON_STYLES = `
  :host {
    --ds-icon-size: 16px;
    color: currentColor;
    display: inline-flex;
    flex: none;
    height: var(--ds-icon-size);
    line-height: 0;
    vertical-align: -0.125em;
    width: var(--ds-icon-size);
  }

  :host([hidden]) {
    display: none;
  }

  .ds-icon {
    color: currentColor;
    display: block;
    height: 100%;
    width: 100%;
  }
`;

let iconStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getIconStyleSheet() {
  if (!iconStyleSheet) {
    iconStyleSheet = new CSSStyleSheet();
    iconStyleSheet.replaceSync(ICON_STYLES);
  }

  return iconStyleSheet;
}

export function applyIconStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getIconStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-icon]")) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.dataset.dsIcon = "";
  styleElement.textContent = ICON_STYLES;
  shadowRoot.prepend(styleElement);
}
