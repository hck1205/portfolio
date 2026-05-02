import { STEPS_STYLES } from "../Steps.styles";

let stepsStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getStepsStyleSheet() {
  if (!stepsStyleSheet) {
    stepsStyleSheet = new CSSStyleSheet();
    stepsStyleSheet.replaceSync(STEPS_STYLES);
  }

  return stepsStyleSheet;
}

export function applyStepsStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getStepsStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-steps]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsSteps = "";
  styleElement.textContent = STEPS_STYLES;
  shadowRoot.prepend(styleElement);
}
