import { PROGRESS_STYLES } from "../Progress.styles";

let progressStyleSheet: CSSStyleSheet | undefined;

export function applyProgressStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    if (!progressStyleSheet) {
      progressStyleSheet = new CSSStyleSheet();
      progressStyleSheet.replaceSync(PROGRESS_STYLES);
    }

    if (!shadowRoot.adoptedStyleSheets.includes(progressStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, progressStyleSheet];
    }

    return;
  }

  const styleElement = document.createElement("style");

  styleElement.textContent = PROGRESS_STYLES;
  shadowRoot.prepend(styleElement);
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}
