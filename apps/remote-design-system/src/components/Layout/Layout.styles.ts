export const LAYOUT_STYLES = `
  :host {
    box-sizing: border-box;
    display: block;
    flex: auto;
    min-height: 0;
    min-width: 0;
  }

  .ds-layout {
    background: var(--color-ds-canvas);
    color: var(--color-ds-text);
    display: flex;
    flex: auto;
    flex-direction: column;
    font-family: var(--font-sans);
    height: 100%;
    min-height: 0;
    min-width: 0;
  }

  .ds-layout > slot {
    display: contents;
  }

  :host([has-sider]) .ds-layout,
  :host([data-has-sider]) .ds-layout {
    align-items: stretch;
    flex-direction: row;
  }
`;

export const LAYOUT_REGION_STYLES = `
  :host {
    box-sizing: border-box;
    display: block;
    flex: none;
    min-width: 0;
  }

  :host(ds-layout-content) {
    flex: auto;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .ds-layout-region {
    height: auto;
    min-width: 0;
    width: 100%;
  }

  .ds-layout-region > slot {
    display: contents;
  }

  .ds-layout-header {
    align-items: center;
    background: var(--ds-layout-header-bg, var(--color-neutral-static-dark));
    color: var(--ds-layout-header-color, var(--color-neutral-static-light));
    display: flex;
    font-family: var(--font-sans);
    min-height: var(--ds-layout-header-height, 64px);
    padding: var(--ds-layout-header-padding, 0 var(--spacing-ds-10));
  }

  .ds-layout-content {
    background: var(--ds-layout-content-bg, transparent);
    color: var(--color-ds-text);
    display: block;
    flex: auto;
    font-family: var(--font-sans);
    height: 100%;
    min-height: 0;
    overflow: auto;
    padding: var(--ds-layout-content-padding, 0);
  }

  .ds-layout-footer {
    background: var(--ds-layout-footer-bg, var(--color-ds-surface));
    border-block-start: var(--ds-border-width-default) solid var(--color-ds-border);
    color: var(--color-ds-muted);
    font-family: var(--font-sans);
    padding: var(--ds-layout-footer-padding, var(--spacing-ds-6) var(--spacing-ds-10));
  }
`;

export const LAYOUT_SIDER_STYLES = `
  :host {
    --ds-layout-sider-current-width: var(--ds-layout-sider-width, 200px);
    box-sizing: border-box;
    display: block;
    flex: 0 0 var(--ds-layout-sider-current-width);
    max-width: var(--ds-layout-sider-current-width);
    min-width: var(--ds-layout-sider-current-width);
    position: relative;
    transition:
      flex-basis 180ms ease-in-out,
      max-width 180ms ease-in-out,
      min-width 180ms ease-in-out;
    width: var(--ds-layout-sider-current-width);
  }

  :host([collapsed]) {
    --ds-layout-sider-current-width: var(--ds-layout-sider-collapsed-width, 80px);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  [hidden] {
    display: none !important;
  }

  .ds-layout-sider {
    --ds-layout-sider-bg: var(--color-neutral-solid-n9);
    --ds-layout-sider-trigger-bg: var(--color-neutral-alpha-n8);
    --ds-layout-sider-trigger-color: var(--color-neutral-solid-n3);
    --ds-layout-sider-trigger-icon-color: var(--color-indigo-solid-indigo4);
    background: var(--ds-layout-sider-bg);
    color: var(--ds-layout-sider-color, var(--color-neutral-static-light));
    display: flex;
    flex-direction: column;
    font-family: var(--font-sans);
    height: 100%;
    min-height: 0;
    min-width: 0;
  }

  :host([theme="light"]) .ds-layout-sider {
    --ds-layout-sider-bg: var(--color-ds-surface);
    --ds-layout-sider-color: var(--color-ds-text);
    --ds-layout-sider-trigger-bg: var(--color-ds-subtle-surface);
    --ds-layout-sider-trigger-color: var(--color-ds-muted);
    --ds-layout-sider-trigger-icon-color: var(--color-ds-primary);
    border-inline-end: var(--ds-border-width-default) solid var(--color-ds-border);
  }

  .ds-layout-sider__body {
    flex: auto;
    min-height: 0;
    min-width: 0;
    overflow: auto;
  }

  .ds-layout-sider__trigger {
    align-items: center;
    appearance: none;
    background: var(--ds-layout-sider-trigger-bg);
    border: 0;
    color: var(--ds-layout-sider-trigger-color);
    cursor: pointer;
    display: flex;
    border-block-end: 1px solid rgba(255, 255, 255, 0.12);
    flex: 0 0 44px;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    font-weight: var(--ds-font-weight-strong);
    gap: var(--spacing-ds-2);
    height: 44px;
    justify-content: flex-end;
    line-height: var(--leading-ds-tight);
    padding: 0 var(--spacing-ds-3);
    transition:
      background-color 150ms ease-in-out,
      color 150ms ease-in-out;
    width: 100%;
  }

  :host([theme="light"]) .ds-layout-sider__trigger {
    --ds-layout-sider-trigger-bg: var(--color-ds-surface);
    --ds-layout-sider-trigger-color: var(--color-ds-text);
    border-block-end: var(--ds-border-width-default) solid var(--color-ds-border);
  }

  .ds-layout-sider__trigger:hover {
    background: var(--color-neutral-alpha-n7);
    color: var(--color-neutral-static-light);
  }

  :host([theme="light"]) .ds-layout-sider__trigger:hover {
    background: var(--color-neutral-alpha-n2);
    color: var(--color-ds-text);
  }

  .ds-layout-sider__trigger:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-layout-sider__trigger-icon {
    color: var(--ds-layout-sider-trigger-icon-color);
    display: inline-block;
    transition: transform 180ms ease-in-out;
  }

  :host([collapsed]) .ds-layout-sider__trigger-icon {
    transform: rotate(180deg);
  }

  :host([reverse-arrow]) .ds-layout-sider__trigger-icon {
    transform: rotate(180deg);
  }

  :host([collapsed][reverse-arrow]) .ds-layout-sider__trigger-icon {
    transform: rotate(0deg);
  }

  :host([collapsed]) .ds-layout-sider__trigger {
    justify-content: center;
    padding-inline: 0;
  }

  :host([collapsed]) .ds-layout-sider__trigger-label {
    display: none;
  }

  .ds-layout-sider__zero-trigger {
    align-items: center;
    background: var(--ds-layout-sider-trigger-bg);
    border: 0;
    border-radius: 0 var(--radius-ds-sm) var(--radius-ds-sm) 0;
    color: var(--ds-layout-sider-trigger-icon-color);
    cursor: pointer;
    display: none;
    height: 40px;
    justify-content: center;
    inset-block-start: var(--spacing-ds-4);
    inset-inline-end: -40px;
    padding: 0;
    position: absolute;
    width: 40px;
    z-index: 1;
  }

  :host([collapsed][data-zero-width][collapsible]) .ds-layout-sider__zero-trigger {
    display: flex;
  }

  :host([reverse-arrow]) .ds-layout-sider__zero-trigger {
    border-radius: var(--radius-ds-sm) 0 0 var(--radius-ds-sm);
    inset-inline-end: auto;
    inset-inline-start: -40px;
  }
`;
