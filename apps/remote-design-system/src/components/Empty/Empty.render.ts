import { Inbox, createElement as createLucideElement } from "lucide";

import { EMPTY_STYLES } from "./Empty.styles";

let emptyStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getEmptyStyleSheet() {
  if (!emptyStyleSheet) {
    emptyStyleSheet = new CSSStyleSheet();
    emptyStyleSheet.replaceSync(EMPTY_STYLES);
  }

  return emptyStyleSheet;
}

export function applyEmptyStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getEmptyStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-empty]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsEmpty = "";
  styleElement.textContent = EMPTY_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createEmptyIllustration(kind: "default" | "simple") {
  const wrapper = document.createElement("span");
  const icon = createLucideElement(Inbox, {
    "aria-hidden": "true",
    class: "ds-empty__icon",
    focusable: "false",
    "stroke-width": kind === "simple" ? 1.75 : 1.5
  });

  wrapper.className = "ds-empty__illustration";
  wrapper.dataset.variant = kind;
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.append(icon);

  return wrapper;
}
