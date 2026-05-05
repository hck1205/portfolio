export const CARD_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
    max-width: 100%;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-card {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    display: grid;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    transition:
      border-color 150ms ease,
      box-shadow 150ms ease,
      transform 150ms ease;
  }

  :host([variant="borderless"]) .ds-card {
    border-color: transparent;
  }

  :host([hoverable="true"]) .ds-card:hover {
    box-shadow: var(--shadow-ds-card);
    transform: translateY(-1px);
  }

  :host([type="inner"]) .ds-card {
    background: var(--color-ds-surface-muted, var(--color-neutral-alpha-n1));
  }

  :host([type="inner"]) .ds-card__body {
    background: var(--color-ds-surface, #fff);
  }

  .ds-card__cover {
    display: block;
    min-width: 0;
  }

  .ds-card__cover img {
    aspect-ratio: 16 / 9;
    display: block;
    object-fit: cover;
    width: 100%;
  }

  .ds-card__header {
    align-items: center;
    border-block-end: var(--ds-border-width-default) solid var(--color-ds-border);
    display: flex;
    gap: var(--spacing-ds-3);
    min-height: 56px;
    padding: 0 var(--spacing-ds-5);
  }

  :host([size="small"]) .ds-card__header {
    min-height: 38px;
    padding: 0 var(--spacing-ds-3);
  }

  .ds-card__title {
    flex: 1 1 auto;
    font-size: var(--text-ds-3);
    font-weight: var(--font-weight-ds-semibold, 600);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([size="small"]) .ds-card__title {
    font-size: var(--text-ds-2);
  }

  .ds-card__extra {
    color: var(--color-ds-muted);
    flex: none;
    font-size: var(--text-ds-1);
  }

  .ds-card__extra-link {
    color: var(--color-ds-primary);
    text-decoration: none;
  }

  .ds-card__extra-link:hover {
    text-decoration: underline;
  }

  .ds-card__extra-link:focus-visible {
    border-radius: var(--radius-level1);
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-card__body {
    min-width: 0;
    padding: var(--spacing-ds-5);
  }

  :host([size="small"]) .ds-card__body {
    padding: var(--spacing-ds-3);
  }

  .ds-card__actions {
    align-items: stretch;
    background: var(--color-ds-surface);
    border-block-start: var(--ds-border-width-default) solid var(--color-ds-border);
    display: flex;
  }

  .ds-card__actions ::slotted(*) {
    align-items: center;
    border-inline-end: var(--ds-border-width-default) solid var(--color-ds-border);
    color: var(--color-ds-muted);
    display: inline-flex;
    flex: 1 1 0;
    justify-content: center;
    min-height: 40px;
  }

  .ds-card__loading {
    display: grid;
    gap: var(--spacing-ds-3);
    min-width: 0;
    padding: var(--spacing-ds-5);
  }

  :host([size="small"]) .ds-card__loading {
    padding: var(--spacing-ds-3);
  }

  .ds-card__skeleton {
    animation: ds-card-loading 1.2s infinite ease-in-out;
    background: linear-gradient(90deg, var(--color-neutral-alpha-n2), var(--color-neutral-alpha-n4), var(--color-neutral-alpha-n2));
    background-size: 200% 100%;
    border-radius: var(--radius-level1);
    height: 14px;
  }

  .ds-card__skeleton:nth-child(2) {
    width: 82%;
  }

  .ds-card__skeleton:nth-child(3) {
    width: 64%;
  }

  [hidden] {
    display: none !important;
  }

  @keyframes ds-card-loading {
    0% {
      background-position: 200% 0;
    }

    100% {
      background-position: -200% 0;
    }
  }
`;

export const CARD_GRID_STYLES = `
  :host {
    background: var(--color-ds-surface);
    border-block-end: var(--ds-border-width-default) solid var(--color-ds-border);
    border-inline-end: var(--ds-border-width-default) solid var(--color-ds-border);
    box-sizing: border-box;
    color: var(--color-ds-text);
    display: inline-grid;
    font-family: var(--font-sans);
    min-height: 7rem;
    padding: var(--spacing-ds-5);
    place-items: center;
    transition:
      box-shadow 150ms ease,
      transform 150ms ease;
    vertical-align: top;
    width: 33.333%;
  }

  :host([hoverable="true"]:hover) {
    box-shadow: var(--shadow-ds-card);
    transform: translateY(-1px);
    z-index: 1;
  }
`;

export const CARD_META_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
  }

  .ds-card-meta {
    align-items: flex-start;
    display: flex;
    gap: var(--spacing-ds-3);
    min-width: 0;
  }

  .ds-card-meta__avatar {
    border-radius: var(--radius-full);
    flex: none;
    height: 40px;
    overflow: hidden;
    width: 40px;
  }

  .ds-card-meta__avatar img {
    display: block;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .ds-card-meta__content {
    display: grid;
    gap: var(--spacing-ds-1);
    min-width: 0;
  }

  .ds-card-meta__title {
    font-weight: var(--font-weight-ds-semibold, 600);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-card-meta__description {
    color: var(--color-ds-muted);
    line-height: var(--leading-ds-normal, 1.5);
  }
`;

let cardStyleSheet: CSSStyleSheet | undefined;
let cardGridStyleSheet: CSSStyleSheet | undefined;
let cardMetaStyleSheet: CSSStyleSheet | undefined;

export function applyCardStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    cardStyleSheet ??= new CSSStyleSheet();
    cardStyleSheet.replaceSync(CARD_STYLES);
    shadowRoot.adoptedStyleSheets = [cardStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = CARD_STYLES;
  shadowRoot.append(style);
}

export function applyCardGridStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    cardGridStyleSheet ??= new CSSStyleSheet();
    cardGridStyleSheet.replaceSync(CARD_GRID_STYLES);
    shadowRoot.adoptedStyleSheets = [cardGridStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = CARD_GRID_STYLES;
  shadowRoot.append(style);
}

export function applyCardMetaStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    cardMetaStyleSheet ??= new CSSStyleSheet();
    cardMetaStyleSheet.replaceSync(CARD_META_STYLES);
    shadowRoot.adoptedStyleSheets = [cardMetaStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = CARD_META_STYLES;
  shadowRoot.append(style);
}
