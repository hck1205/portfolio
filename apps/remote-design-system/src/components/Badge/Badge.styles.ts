export const BADGE_STYLES = `
  :host {
    display: inline-block;
    font-family: var(--font-sans);
    line-height: 1;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-badge {
    display: inline-block;
    max-width: 100%;
    position: relative;
  }

  .ds-badge__content {
    display: inline-block;
    max-width: 100%;
  }

  .ds-badge__indicator {
    --ds-badge-color: var(--color-ds-danger, #ff4d4f);
    align-items: center;
    background: var(--ds-badge-color);
    border-radius: var(--radius-full);
    box-shadow: 0 0 0 1px var(--color-ds-surface);
    box-sizing: border-box;
    color: var(--color-white, #fff);
    display: inline-flex;
    font-size: var(--text-ds-1);
    font-weight: var(--font-weight-ds-medium, 500);
    height: 20px;
    justify-content: center;
    min-width: 20px;
    padding: 0 6px;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%) translate(var(--ds-badge-offset-x), var(--ds-badge-offset-y));
    transform-origin: 100% 0;
    transition:
      background 150ms ease,
      transform 150ms ease;
    white-space: nowrap;
    z-index: 1;
  }

  .ds-badge__indicator[data-standalone="true"] {
    position: static;
    transform: none;
  }

  .ds-badge__indicator[data-dot="true"] {
    height: 6px;
    min-width: 6px;
    padding: 0;
    width: 6px;
  }

  .ds-badge__indicator[data-size="small"]:not([data-dot="true"]) {
    height: 14px;
    min-width: 14px;
    padding: 0 4px;
  }

  .ds-badge__indicator[data-hidden="true"] {
    display: none;
  }

  .ds-badge__indicator[data-status="default"] {
    --ds-badge-color: var(--color-ds-muted);
  }

  .ds-badge__indicator[data-status="error"] {
    --ds-badge-color: var(--color-ds-danger, #ff4d4f);
  }

  .ds-badge__indicator[data-status="processing"] {
    --ds-badge-color: var(--color-ds-primary);
  }

  .ds-badge__indicator[data-status="success"] {
    --ds-badge-color: var(--color-ds-success, #52c41a);
  }

  .ds-badge__indicator[data-status="warning"] {
    --ds-badge-color: var(--color-ds-warning, #faad14);
  }

  .ds-badge__indicator[data-status="processing"]::after {
    animation: ds-badge-pulse 1.2s infinite ease-in-out;
    border: 1px solid var(--ds-badge-color);
    border-radius: inherit;
    content: "";
    inset: 0;
    position: absolute;
  }

  .ds-badge__status {
    align-items: center;
    color: var(--color-ds-text);
    display: inline-flex;
    gap: var(--spacing-ds-2);
    line-height: var(--leading-ds-normal, 1.5);
  }

  @keyframes ds-badge-pulse {
    0% {
      opacity: 0.8;
      transform: scale(1);
    }

    100% {
      opacity: 0;
      transform: scale(2.4);
    }
  }
`;

export const BADGE_RIBBON_STYLES = `
  :host {
    display: block;
    font-family: var(--font-sans);
    position: relative;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-badge-ribbon {
    display: block;
    max-width: 100%;
    position: relative;
  }

  .ds-badge-ribbon__content {
    display: block;
  }

  .ds-badge-ribbon__label {
    --ds-ribbon-color: var(--color-ds-primary);
    background: var(--ds-ribbon-color);
    border-radius: var(--radius-level1) var(--radius-level1) 0 var(--radius-level1);
    color: var(--color-white, #fff);
    font-size: var(--text-ds-1);
    line-height: var(--leading-ds-normal, 1.5);
    max-width: calc(100% - var(--spacing-ds-4));
    overflow: hidden;
    padding: var(--spacing-ds-1) var(--spacing-ds-3);
    position: absolute;
    text-overflow: ellipsis;
    top: var(--spacing-ds-3);
    white-space: nowrap;
    z-index: 1;
  }

  :host([placement="end"]) .ds-badge-ribbon__label {
    border-radius: var(--radius-level1) var(--radius-level1) 0 var(--radius-level1);
    right: calc(var(--spacing-ds-2) * -1);
  }

  :host([placement="start"]) .ds-badge-ribbon__label {
    border-radius: var(--radius-level1) var(--radius-level1) var(--radius-level1) 0;
    left: calc(var(--spacing-ds-2) * -1);
  }
`;

let badgeStyleSheet: CSSStyleSheet | undefined;
let ribbonStyleSheet: CSSStyleSheet | undefined;

export function applyBadgeStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    badgeStyleSheet ??= new CSSStyleSheet();
    badgeStyleSheet.replaceSync(BADGE_STYLES);
    shadowRoot.adoptedStyleSheets = [badgeStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = BADGE_STYLES;
  shadowRoot.append(style);
}

export function applyBadgeRibbonStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    ribbonStyleSheet ??= new CSSStyleSheet();
    ribbonStyleSheet.replaceSync(BADGE_RIBBON_STYLES);
    shadowRoot.adoptedStyleSheets = [ribbonStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = BADGE_RIBBON_STYLES;
  shadowRoot.append(style);
}
