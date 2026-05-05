export const MODAL_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    inset: 0;
    line-height: var(--leading-ds-readable);
    overflow: hidden;
    pointer-events: none;
    position: fixed;
    z-index: var(--z-index-ds-modal, 1050);
  }

  .ds-modal {
    align-items: flex-start;
    display: grid;
    inset: 0;
    justify-items: center;
    overflow: auto;
    padding: 12vh var(--spacing-ds-5) var(--spacing-ds-8);
    pointer-events: none;
    position: absolute;
  }

  .ds-modal[data-open="false"] {
    visibility: hidden;
  }

  .ds-modal[data-centered="true"] {
    align-items: center;
    padding-block: var(--spacing-ds-8);
  }

  .ds-modal__mask {
    background: rgba(15, 23, 42, 0.46);
    inset: 0;
    opacity: 0;
    position: absolute;
    transition: opacity 180ms ease;
  }

  .ds-modal[data-mask="false"] .ds-modal__mask {
    display: none;
  }

  .ds-modal__mask[hidden] {
    display: none;
  }

  .ds-modal[data-open="true"] {
    visibility: visible;
  }

  .ds-modal[data-open="true"][data-mask="true"] {
    pointer-events: auto;
  }

  .ds-modal[data-open="true"] .ds-modal__mask {
    opacity: 1;
  }

  .ds-modal__dialog {
    background: var(--color-ds-surface);
    border: 1px solid var(--color-ds-border);
    border-radius: var(--radius-ds-md);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    max-height: calc(100vh - var(--spacing-ds-10));
    max-width: min(100%, var(--ds-modal-width, 520px));
    min-width: min(100%, 320px);
    opacity: 0;
    pointer-events: auto;
    position: relative;
    transform: translateY(-12px) scale(0.98);
    transition:
      opacity 180ms ease,
      transform 200ms ease;
    width: var(--ds-modal-width, 520px);
  }

  .ds-modal[data-open="true"] .ds-modal__dialog {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .ds-modal__header {
    align-items: center;
    display: flex;
    gap: var(--spacing-ds-3);
    justify-content: space-between;
    padding: var(--spacing-ds-5) var(--spacing-ds-5) var(--spacing-ds-3);
  }

  .ds-modal__title {
    font-size: var(--text-ds-4);
    font-weight: var(--font-weight-ds-strong);
    line-height: var(--leading-ds-tight);
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .ds-modal__close {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: 32px;
    justify-content: center;
    padding: 0;
    width: 32px;
  }

  .ds-modal__close:hover {
    background: var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.05));
    color: var(--color-ds-text);
  }

  .ds-modal__close:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-modal__close[hidden] {
    display: none;
  }

  .ds-modal__close svg {
    height: var(--size-ds-icon-md);
    width: var(--size-ds-icon-md);
  }

  .ds-modal__body {
    min-height: 0;
    overflow: auto;
    padding: var(--spacing-ds-2) var(--spacing-ds-5) var(--spacing-ds-5);
  }

  .ds-modal__footer {
    align-items: center;
    display: flex;
    gap: var(--spacing-ds-2);
    justify-content: flex-end;
    padding: 0 var(--spacing-ds-5) var(--spacing-ds-5);
  }

  .ds-modal__footer[hidden] {
    display: none;
  }
`;
