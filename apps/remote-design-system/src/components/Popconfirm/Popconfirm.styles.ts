export const POPCONFIRM_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-readable);
    position: relative;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-popconfirm__trigger {
    display: inline-flex;
  }

  .ds-popconfirm__popup {
    background: var(--color-ds-surface);
    border: 1px solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-3);
    min-width: 240px;
    padding: var(--spacing-ds-4);
    position: absolute;
    z-index: var(--z-index-ds-popover, 1000);
  }

  .ds-popconfirm__popup[hidden] {
    display: none;
  }

  :host([placement="top"]) .ds-popconfirm__popup {
    bottom: calc(100% + var(--spacing-ds-2));
    left: 50%;
    transform: translateX(-50%);
  }

  :host([placement="bottom"]) .ds-popconfirm__popup {
    left: 50%;
    top: calc(100% + var(--spacing-ds-2));
    transform: translateX(-50%);
  }

  :host([placement="left"]) .ds-popconfirm__popup {
    right: calc(100% + var(--spacing-ds-2));
    top: 50%;
    transform: translateY(-50%);
  }

  :host([placement="right"]) .ds-popconfirm__popup {
    left: calc(100% + var(--spacing-ds-2));
    top: 50%;
    transform: translateY(-50%);
  }

  .ds-popconfirm__content {
    display: grid;
    gap: var(--spacing-ds-1);
    min-width: 0;
  }

  .ds-popconfirm__title {
    font-weight: var(--font-weight-ds-strong);
    line-height: var(--leading-ds-tight);
    margin: 0;
  }

  .ds-popconfirm__description {
    color: var(--color-ds-muted);
    margin: 0;
  }

  .ds-popconfirm__description[hidden] {
    display: none;
  }

  .ds-popconfirm__actions {
    display: flex;
    gap: var(--spacing-ds-2);
    justify-content: flex-end;
  }

  .ds-popconfirm__button {
    border: 1px solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    cursor: pointer;
    font: inherit;
    font-weight: var(--font-weight-ds-strong);
    height: 30px;
    padding: 0 var(--spacing-ds-3);
  }

  .ds-popconfirm__button:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-popconfirm__button--cancel {
    background: var(--color-ds-surface);
    color: var(--color-ds-text);
  }

  .ds-popconfirm__button--ok {
    background: var(--color-ds-primary);
    border-color: var(--color-ds-primary);
    color: var(--color-ds-surface);
  }
`;
