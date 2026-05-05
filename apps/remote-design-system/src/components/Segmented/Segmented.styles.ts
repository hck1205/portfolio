export const SEGMENTED_STYLES = `
  :host {
    --ds-segmented-bg: var(--ds-color-subtle-surface, var(--color-neutral-alpha-n1));
    --ds-segmented-border: var(--color-ds-border);
    --ds-segmented-color: var(--color-ds-muted, var(--color-ds-text-secondary, var(--color-ds-text)));
    --ds-segmented-hover-bg: var(--color-neutral-alpha-n2);
    --ds-segmented-hover-color: var(--color-ds-text);
    --ds-segmented-selected-bg: var(--color-indigo-alpha-indigo2, color-mix(in srgb, var(--color-ds-primary) 12%, var(--color-ds-surface)));
    --ds-segmented-selected-border: var(--color-ds-primary);
    --ds-segmented-selected-color: var(--color-ds-primary);
    --ds-segmented-selected-shadow:
      inset 0 0 0 1px var(--ds-segmented-selected-border),
      0 1px 2px color-mix(in srgb, var(--color-ds-primary) 18%, transparent);
    --ds-segmented-disabled-opacity: 0.48;
    --ds-segmented-gap: var(--spacing-ds-1);
    --ds-segmented-height: var(--spacing-m1);
    --ds-segmented-item-radius: calc(var(--radius-ds-sm) - 1px);
    --ds-segmented-padding: var(--spacing-ds-1);
    --ds-segmented-padding-inline: var(--spacing-ds-4);
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    font-weight: var(--font-weight-ds-strong, 700);
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
    --ds-segmented-padding-inline: var(--spacing-ds-3);
    font-size: var(--text-ds-1);
  }

  :host([size="middle"]) {
    --ds-segmented-height: 32px;
  }

  :host([size="large"]) {
    --ds-segmented-height: 40px;
    --ds-segmented-padding-inline: var(--spacing-ds-5);
    font-size: var(--text-ds-3);
  }

  .ds-segmented {
    align-items: stretch;
    background: var(--ds-segmented-bg);
    border: var(--ds-border-width-default, 1px) solid var(--ds-segmented-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-neutral-static-light) 44%, transparent);
    box-sizing: border-box;
    display: inline-flex;
    gap: var(--ds-segmented-gap);
    max-width: 100%;
    min-height: var(--ds-segmented-height);
    overflow: hidden;
    padding: var(--ds-segmented-padding);
    position: relative;
  }

  :host([block]) .ds-segmented {
    width: 100%;
  }

  :host([orientation="vertical"]) .ds-segmented {
    flex-direction: column;
  }

  :host([shape="round"]) .ds-segmented {
    border-radius: 999px;
  }

  .ds-segmented__item {
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--ds-segmented-item-radius);
    box-sizing: border-box;
    color: var(--ds-segmented-color);
    cursor: pointer;
    align-items: center;
    display: inline-flex;
    flex: 0 1 auto;
    font: inherit;
    font-weight: inherit;
    gap: var(--spacing-ds-2);
    justify-content: center;
    line-height: var(--leading-ds-tight);
    margin: 0;
    min-height: calc(var(--ds-segmented-height) - var(--ds-segmented-padding) * 2);
    min-width: 0;
    padding: 0 var(--ds-segmented-padding-inline);
    position: relative;
    text-align: center;
    transition:
      color 150ms ease-in-out,
      opacity 150ms ease-in-out;
    user-select: none;
    white-space: nowrap;
    z-index: 1;
  }

  :host([block]) .ds-segmented__item {
    flex: 1 1 0;
    width: 100%;
  }

  :host([shape="round"]) .ds-segmented__item {
    border-radius: 999px;
  }

  .ds-segmented__item:hover:not(:disabled) {
    background: var(--ds-segmented-hover-bg);
    color: var(--ds-segmented-hover-color);
  }

  .ds-segmented__item[data-selected="true"] {
    color: var(--ds-segmented-selected-color);
  }

  .ds-segmented__item[data-selected="true"]:hover:not(:disabled) {
    color: var(--color-ds-primary-hover);
  }

  .ds-segmented__item:focus-visible {
    box-shadow:
      var(--ds-segmented-selected-shadow),
      0 0 0 2px color-mix(in srgb, var(--color-ds-primary) 24%, transparent);
    outline: 0;
  }

  .ds-segmented__item:disabled,
  :host([disabled]) .ds-segmented__item {
    cursor: not-allowed;
    opacity: var(--ds-segmented-disabled-opacity);
  }

  .ds-segmented__item:disabled:hover,
  :host([disabled]) .ds-segmented__item:hover {
    background: transparent;
    color: var(--ds-segmented-color);
  }

  .ds-segmented__item[data-selected="true"]:disabled,
  :host([disabled]) .ds-segmented__item[data-selected="true"] {
    color: var(--color-ds-text);
  }

  .ds-segmented__label {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    line-height: inherit;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ds-segmented__icon {
    align-items: center;
    display: inline-flex;
    flex: none;
    height: var(--size-ds-icon-md, 16px);
    justify-content: center;
    width: var(--size-ds-icon-md, 16px);
  }

  .ds-segmented__icon svg {
    display: block;
    height: 14px;
    width: 14px;
  }

  .ds-segmented__indicator {
    background: var(--ds-segmented-selected-bg);
    border-radius: var(--ds-segmented-item-radius);
    box-shadow: var(--ds-segmented-selected-shadow);
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    transition:
      transform 180ms cubic-bezier(0.2, 0, 0, 1),
      width 180ms cubic-bezier(0.2, 0, 0, 1),
      height 180ms cubic-bezier(0.2, 0, 0, 1);
    z-index: 0;
  }

  .ds-segmented__indicator[hidden] {
    display: none;
  }

  :host([shape="round"]) .ds-segmented__indicator {
    border-radius: 999px;
  }

  :host([disabled]) .ds-segmented__indicator {
    background: var(--color-neutral-alpha-n2);
    box-shadow: inset 0 0 0 1px var(--color-ds-border);
  }
`;
