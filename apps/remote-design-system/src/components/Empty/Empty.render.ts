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
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const width = kind === "simple" ? "112" : "160";
  const height = kind === "simple" ? "72" : "112";

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  if (kind === "simple") {
    svg.innerHTML = `
      <ellipse cx="56" cy="60" rx="44" ry="8" fill="var(--color-neutral-alpha-n3, rgba(0,0,0,0.08))" />
      <path d="M28 24h56l8 28H20l8-28Z" fill="var(--color-ds-bg-container, #fff)" stroke="var(--color-ds-border, #d9d9d9)" />
      <path d="M20 52h72l-10 12H30L20 52Z" fill="var(--color-neutral-alpha-n2, rgba(0,0,0,0.04))" stroke="var(--color-ds-border, #d9d9d9)" />
      <path d="M42 36h28" stroke="var(--color-ds-border, #d9d9d9)" stroke-linecap="round" />
    `;
    return svg;
  }

  svg.innerHTML = `
    <ellipse cx="80" cy="96" rx="58" ry="10" fill="var(--color-neutral-alpha-n3, rgba(0,0,0,0.08))" />
    <path d="M38 28h84l12 48H26l12-48Z" fill="var(--color-ds-bg-container, #fff)" stroke="var(--color-ds-border, #d9d9d9)" />
    <path d="M26 76h108l-17 20H43L26 76Z" fill="var(--color-neutral-alpha-n2, rgba(0,0,0,0.04))" stroke="var(--color-ds-border, #d9d9d9)" />
    <path d="M56 46h48M62 58h36" stroke="var(--color-ds-border, #d9d9d9)" stroke-linecap="round" />
    <circle cx="120" cy="22" r="8" fill="var(--color-ds-primary-bg, #e6f4ff)" stroke="var(--color-ds-primary, #1677ff)" />
    <path d="M116 22h8M120 18v8" stroke="var(--color-ds-primary, #1677ff)" stroke-linecap="round" />
  `;

  return svg;
}
