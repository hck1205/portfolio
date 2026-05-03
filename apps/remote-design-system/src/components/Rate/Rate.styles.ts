export const RATE_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-tight);
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  :host([size="small"]) {
    --ds-rate-size: var(--spacing-ds-4);
  }

  :host([size="large"]) {
    --ds-rate-size: var(--spacing-ds-7);
  }

  .ds-rate {
    --ds-rate-active-color: var(--color-ds-warning, #fadb14);
    --ds-rate-inactive-color: var(--color-neutral-alpha-n4);
    --ds-rate-size: var(--spacing-ds-5);
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-ds-1);
    outline: 0;
  }

  .ds-rate:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-rate__item {
    appearance: none;
    background: transparent;
    border: 0;
    color: var(--ds-rate-inactive-color);
    cursor: pointer;
    display: inline-grid;
    font: inherit;
    height: calc(var(--ds-rate-size) + var(--spacing-ds-2));
    padding: 0;
    place-items: center;
    position: relative;
    width: calc(var(--ds-rate-size) + var(--spacing-ds-2));
  }

  .ds-rate__character {
    display: inline-block;
    font-size: var(--ds-rate-size);
    line-height: 1;
    transition:
      color 150ms ease-in-out,
      transform 150ms ease-in-out;
  }

  .ds-rate__item:hover .ds-rate__character {
    transform: scale(1.08);
  }

  .ds-rate__item[data-active="true"],
  .ds-rate__item[data-half="true"] {
    color: var(--ds-rate-active-color);
  }

  .ds-rate__item[data-half="true"] .ds-rate__character {
    background: linear-gradient(90deg, var(--ds-rate-active-color) 50%, var(--ds-rate-inactive-color) 50%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  :host([disabled]) .ds-rate {
    opacity: 0.72;
  }

  :host([disabled]) .ds-rate__item {
    cursor: not-allowed;
  }
`;
