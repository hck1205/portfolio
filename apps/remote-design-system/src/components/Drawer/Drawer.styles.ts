export const DRAWER_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: contents;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-readable);
  }

  .ds-drawer {
    inset: 0;
    pointer-events: none;
    position: fixed;
    z-index: var(--z-index-ds-overlay, 1000);
  }

  .ds-drawer[data-open="false"] {
    visibility: hidden;
  }

  .ds-drawer__mask {
    background: rgba(15, 23, 42, 0.42);
    inset: 0;
    opacity: 0;
    position: absolute;
    transition: opacity 180ms ease;
  }

  .ds-drawer[data-open="true"] {
    pointer-events: auto;
    visibility: visible;
  }

  .ds-drawer[data-open="true"] .ds-drawer__mask {
    opacity: 1;
  }

  .ds-drawer[data-mask="false"] .ds-drawer__mask {
    display: none;
  }

  .ds-drawer__panel {
    background: var(--color-ds-surface);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    max-height: 100vh;
    max-width: 100vw;
    opacity: 0.98;
    position: absolute;
    transition:
      opacity 180ms ease,
      transform 220ms ease;
  }

  .ds-drawer[data-open="true"] .ds-drawer__panel {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .ds-drawer[data-placement="right"] .ds-drawer__panel {
    bottom: 0;
    height: 100%;
    right: 0;
    top: 0;
    transform: translate3d(100%, 0, 0);
    width: var(--ds-drawer-width, 378px);
  }

  .ds-drawer[data-placement="left"] .ds-drawer__panel {
    bottom: 0;
    height: 100%;
    left: 0;
    top: 0;
    transform: translate3d(-100%, 0, 0);
    width: var(--ds-drawer-width, 378px);
  }

  .ds-drawer[data-placement="top"] .ds-drawer__panel {
    height: var(--ds-drawer-height, 320px);
    left: 0;
    right: 0;
    top: 0;
    transform: translate3d(0, -100%, 0);
    width: 100%;
  }

  .ds-drawer[data-placement="bottom"] .ds-drawer__panel {
    bottom: 0;
    height: var(--ds-drawer-height, 320px);
    left: 0;
    right: 0;
    transform: translate3d(0, 100%, 0);
    width: 100%;
  }

  .ds-drawer__header {
    align-items: center;
    border-bottom: 1px solid var(--color-ds-border);
    display: flex;
    gap: var(--spacing-ds-3);
    justify-content: space-between;
    min-width: 0;
    padding: var(--spacing-ds-4) var(--spacing-ds-5);
  }

  .ds-drawer__title {
    color: var(--color-ds-text);
    font-size: var(--text-ds-4);
    font-weight: var(--font-weight-ds-strong);
    line-height: var(--leading-ds-tight);
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .ds-drawer__extra {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-ds-2);
    margin-inline-start: auto;
  }

  .ds-drawer__extra:empty {
    display: none;
  }

  .ds-drawer__close {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 auto;
    height: 32px;
    justify-content: center;
    padding: 0;
    width: 32px;
  }

  .ds-drawer__close:hover {
    background: var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.05));
    color: var(--color-ds-text);
  }

  .ds-drawer__close:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-drawer__close[hidden] {
    display: none;
  }

  .ds-drawer__close svg {
    height: var(--size-ds-icon-md);
    width: var(--size-ds-icon-md);
  }

  .ds-drawer__body {
    min-height: 0;
    overflow: auto;
    padding: var(--spacing-ds-5);
  }

  .ds-drawer__footer {
    align-items: center;
    border-top: 1px solid var(--color-ds-border);
    display: flex;
    gap: var(--spacing-ds-2);
    justify-content: flex-end;
    padding: var(--spacing-ds-4) var(--spacing-ds-5);
  }

  .ds-drawer__footer:empty {
    display: none;
  }
`;
