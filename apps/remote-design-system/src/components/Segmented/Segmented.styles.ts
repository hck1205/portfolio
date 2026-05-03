export const SEGMENTED_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal);
    max-width: 100%;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  :host([block]) {
    display: block;
    width: 100%;
  }

  :host([size="small"]) {
    --ds-segmented-height: 24px;
    --ds-segmented-padding: 2px;
    font-size: var(--text-ds-1);
  }

  :host([size="middle"]) {
    --ds-segmented-height: 32px;
    --ds-segmented-padding: 2px;
  }

  :host([size="large"]) {
    --ds-segmented-height: 40px;
    --ds-segmented-padding: 3px;
    font-size: var(--text-ds-3);
  }

  .ds-segmented {
    --ds-segmented-height: 32px;
    --ds-segmented-padding: 2px;
    align-items: stretch;
    background: var(--color-neutral-alpha-n2);
    border-radius: var(--radius-ds-2);
    box-sizing: border-box;
    display: inline-grid;
    gap: 0;
    grid-auto-flow: column;
    max-width: 100%;
    min-height: var(--ds-segmented-height);
    padding: var(--ds-segmented-padding);
  }

  :host([block]) .ds-segmented {
    display: grid;
    width: 100%;
  }

  :host([orientation="vertical"]) .ds-segmented {
    grid-auto-flow: row;
  }

  :host([shape="round"]) .ds-segmented {
    border-radius: 999px;
  }

  .ds-segmented__item {
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: calc(var(--radius-ds-2) - 1px);
    color: var(--color-ds-text-secondary);
    cursor: pointer;
    font: inherit;
    min-height: calc(var(--ds-segmented-height) - var(--ds-segmented-padding) * 2);
    min-width: 0;
    padding: 0 var(--spacing-ds-3);
    position: relative;
    transition:
      background 140ms ease-in-out,
      box-shadow 140ms ease-in-out,
      color 140ms ease-in-out;
    white-space: nowrap;
  }

  :host([block]) .ds-segmented__item {
    width: 100%;
  }

  :host([shape="round"]) .ds-segmented__item {
    border-radius: 999px;
  }

  .ds-segmented__item:hover:not(:disabled) {
    background: var(--color-neutral-alpha-n3);
    color: var(--color-ds-text);
  }

  .ds-segmented__item[data-selected="true"] {
    background: var(--color-ds-bg-container);
    box-shadow: var(--shadow-ds-sm, 0 1px 2px rgba(0, 0, 0, 0.08));
    color: var(--color-ds-text);
    font-weight: var(--font-weight-ds-medium, 500);
  }

  .ds-segmented__item:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: calc(var(--ds-focus-ring-offset) * -1);
  }

  .ds-segmented__item:disabled,
  :host([disabled]) .ds-segmented__item {
    color: var(--color-ds-text-disabled);
    cursor: not-allowed;
  }

  .ds-segmented__label {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-ds-2);
    justify-content: center;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
