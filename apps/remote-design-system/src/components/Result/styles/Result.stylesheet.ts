import { RESULT_STYLES } from "../Result.styles";

let resultStyleSheet: CSSStyleSheet | undefined;

export function applyResultStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    if (!resultStyleSheet) {
      resultStyleSheet = new CSSStyleSheet();
      resultStyleSheet.replaceSync(RESULT_STYLES);
    }

    if (!shadowRoot.adoptedStyleSheets.includes(resultStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, resultStyleSheet];
    }

    return;
  }

  const styleElement = document.createElement("style");

  styleElement.textContent = RESULT_STYLES;
  shadowRoot.prepend(styleElement);
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}
