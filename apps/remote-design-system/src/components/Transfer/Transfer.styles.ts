export const TRANSFER_STYLES = `
  :host {
    display: inline-block;
    font-family: var(--font-sans);
    max-width: 100%;
    vertical-align: middle;
  }

  .ds-transfer {
    align-items: center;
    color: var(--color-ds-text);
    display: grid;
    gap: var(--spacing-ds-3);
    grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
    max-width: 100%;
  }

  .ds-transfer__list {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    min-height: 260px;
    overflow: hidden;
  }

  :host([status="error"]) .ds-transfer__list {
    border-color: var(--color-ds-danger);
  }

  :host([status="warning"]) .ds-transfer__list {
    border-color: var(--color-ds-warning);
  }

  .ds-transfer__header {
    align-items: center;
    border-block-end: var(--ds-border-width-default) solid var(--color-ds-border);
    display: flex;
    gap: var(--spacing-ds-2);
    min-height: var(--spacing-m3);
    padding: 0 var(--spacing-ds-3);
  }

  .ds-transfer__title {
    flex: 1 1 auto;
    font-size: var(--text-ds-2);
    font-weight: var(--ds-font-weight-strong);
  }

  .ds-transfer__count {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
  }

  .ds-transfer__search {
    border-block-end: var(--ds-border-width-default) solid var(--color-ds-border);
    display: grid;
    padding: var(--spacing-ds-2);
  }

  .ds-transfer__search-input {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-text);
    font: inherit;
    min-height: var(--spacing-m1);
    padding: 0 var(--spacing-ds-2);
  }

  .ds-transfer__items {
    display: grid;
    gap: 0;
    list-style: none;
    margin: 0;
    max-height: 220px;
    overflow: auto;
    padding: var(--spacing-ds-1) 0;
  }

  .ds-transfer__item {
    align-items: center;
    display: grid;
    gap: var(--spacing-ds-3);
    grid-template-columns: auto minmax(0, 1fr);
    cursor: pointer;
    min-height: var(--spacing-m2);
    padding: var(--spacing-ds-2) var(--spacing-ds-3);
  }

  .ds-transfer__item[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.56;
  }

  .ds-transfer__item > input[type="checkbox"],
  .ds-transfer__header > input[type="checkbox"] {
    margin: 0;
  }

  .ds-transfer__item:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
  }

  .ds-transfer__item-title {
    display: block;
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal);
  }

  .ds-transfer__item-description {
    color: var(--color-ds-muted);
    display: block;
    font-size: var(--text-ds-1);
    line-height: var(--leading-ds-normal);
  }

  .ds-transfer__actions {
    display: grid;
    gap: var(--spacing-ds-2);
  }

  .ds-transfer__action {
    align-items: center;
    appearance: none;
    background: var(--color-ds-primary);
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: var(--color-neutral-static-light);
    cursor: pointer;
    display: inline-flex;
    height: var(--spacing-m1);
    justify-content: center;
    padding: 0 var(--spacing-ds-3);
  }

  .ds-transfer__action:disabled {
    background: var(--color-neutral-alpha-n4);
    color: var(--color-ds-muted);
    cursor: not-allowed;
  }

  .ds-transfer__empty {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-2);
    padding: var(--spacing-ds-4);
    text-align: center;
  }

  :host([disabled]) .ds-transfer {
    opacity: 0.64;
  }

  @media (max-width: 640px) {
    .ds-transfer {
      align-items: stretch;
      grid-template-columns: 1fr;
    }

    .ds-transfer__actions {
      grid-auto-flow: column;
      justify-content: center;
    }
  }
`;

let transferStyleSheet: CSSStyleSheet | undefined;

export function applyTransferStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    transferStyleSheet ??= new CSSStyleSheet();
    transferStyleSheet.replaceSync(TRANSFER_STYLES);
    shadowRoot.adoptedStyleSheets = [transferStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = TRANSFER_STYLES;
  shadowRoot.append(style);
}
