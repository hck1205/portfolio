export const TABS_STYLES = `
  :host {
    display: block;
    max-width: 100%;
  }

  [hidden] {
    display: none !important;
  }

  .ds-tabs {
    --ds-tabs-control-block-size: 40px;
    --ds-tabs-gap: var(--spacing-ds-6);
    --ds-tabs-ink-size: 2px;
    color: var(--color-ds-text);
    display: grid;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    gap: var(--spacing-ds-4);
    max-width: 100%;
  }

  .ds-tabs[data-size="large"] {
    --ds-tabs-control-block-size: 48px;
    font-size: var(--text-ds-3);
  }

  .ds-tabs[data-size="small"] {
    --ds-tabs-control-block-size: 32px;
    --ds-tabs-gap: var(--spacing-ds-4);
    font-size: var(--text-ds-1);
  }

  .ds-tabs[data-placement="start"],
  .ds-tabs[data-placement="end"] {
    align-items: start;
    grid-template-columns: max-content minmax(0, 1fr);
  }

  .ds-tabs[data-placement="end"] {
    grid-template-columns: minmax(0, 1fr) max-content;
  }

  .ds-tabs__nav {
    border-block-end: var(--ds-border-width-default) solid var(--color-ds-border);
    min-width: 0;
    overflow: auto hidden;
  }

  .ds-tabs[data-placement="bottom"] .ds-tabs__nav {
    border-block-end: 0;
    border-block-start: var(--ds-border-width-default) solid var(--color-ds-border);
    order: 2;
  }

  .ds-tabs[data-placement="start"] .ds-tabs__nav,
  .ds-tabs[data-placement="end"] .ds-tabs__nav {
    border-block-end: 0;
    overflow: hidden auto;
  }

  .ds-tabs[data-placement="start"] .ds-tabs__nav {
    border-inline-end: var(--ds-border-width-default) solid var(--color-ds-border);
  }

  .ds-tabs[data-placement="end"] .ds-tabs__nav {
    border-inline-start: var(--ds-border-width-default) solid var(--color-ds-border);
    order: 2;
  }

  .ds-tabs__list {
    display: flex;
    gap: var(--ds-tabs-gap);
    min-width: max-content;
    position: relative;
  }

  .ds-tabs__tab-item {
    align-items: center;
    display: inline-flex;
    flex: none;
    min-width: 0;
    position: relative;
  }

  .ds-tabs[data-centered="true"] .ds-tabs__list {
    justify-content: center;
    min-width: 0;
  }

  .ds-tabs[data-placement="start"] .ds-tabs__list,
  .ds-tabs[data-placement="end"] .ds-tabs__list {
    flex-direction: column;
    gap: 0;
    min-width: 0;
  }

  .ds-tabs[data-placement="start"] .ds-tabs__tab-item,
  .ds-tabs[data-placement="end"] .ds-tabs__tab-item {
    display: flex;
  }

  .ds-tabs__tab {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    flex: none;
    font: inherit;
    gap: var(--spacing-ds-2);
    min-height: var(--ds-tabs-control-block-size);
    min-width: 0;
    padding: 0;
    position: relative;
    transition:
      color 150ms ease,
      background-color 150ms ease,
      border-color 150ms ease;
    white-space: nowrap;
  }

  .ds-tabs[data-placement="start"] .ds-tabs__tab,
  .ds-tabs[data-placement="end"] .ds-tabs__tab {
    justify-content: flex-start;
    min-width: 144px;
    padding: 0 var(--spacing-ds-5);
  }

  .ds-tabs__tab:hover {
    color: var(--color-ds-primary-hover);
  }

  .ds-tabs__tab:focus-visible {
    border-radius: var(--radius-ds-sm);
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-tabs__tab[aria-selected="true"] {
    color: var(--color-ds-primary);
    font-weight: var(--font-weight-ds-strong);
  }

  .ds-tabs__tab:disabled {
    color: var(--color-neutral-alpha-n5);
    cursor: not-allowed;
  }

  .ds-tabs__tab::after {
    background: transparent;
    border-radius: var(--radius-full);
    content: "";
    inset-block-end: calc(var(--ds-tabs-ink-size) * -0.5);
    inset-inline: 0;
    height: var(--ds-tabs-ink-size);
    position: absolute;
  }

  .ds-tabs[data-placement="bottom"] .ds-tabs__tab::after {
    inset-block-end: auto;
    inset-block-start: calc(var(--ds-tabs-ink-size) * -0.5);
  }

  .ds-tabs[data-placement="start"] .ds-tabs__tab::after,
  .ds-tabs[data-placement="end"] .ds-tabs__tab::after {
    height: auto;
    inset-block: var(--spacing-ds-2);
    width: var(--ds-tabs-ink-size);
  }

  .ds-tabs[data-placement="start"] .ds-tabs__tab::after {
    inset-inline: auto calc(var(--ds-tabs-ink-size) * -0.5);
  }

  .ds-tabs[data-placement="end"] .ds-tabs__tab::after {
    inset-inline: calc(var(--ds-tabs-ink-size) * -0.5) auto;
  }

  .ds-tabs__tab[aria-selected="true"]::after {
    background: var(--color-ds-primary);
  }

  .ds-tabs__icon {
    align-items: center;
    display: inline-flex;
    flex: none;
    font-size: var(--text-ds-2);
    height: var(--ds-icon-size-md);
    justify-content: center;
    line-height: 1;
    width: var(--ds-icon-size-md);
  }

  .ds-tabs__icon svg {
    display: block;
    height: var(--ds-icon-size-md);
    width: var(--ds-icon-size-md);
  }

  .ds-tabs__close,
  .ds-tabs__add {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    flex: none;
    font: inherit;
    justify-content: center;
    line-height: 1;
    transition:
      background-color 150ms ease,
      color 150ms ease;
  }

  .ds-tabs__close {
    height: 20px;
    margin-inline-end: var(--spacing-ds-1);
    width: 20px;
  }

  .ds-tabs__add {
    min-height: var(--ds-tabs-control-block-size);
    min-width: var(--ds-tabs-control-block-size);
  }

  .ds-tabs__close:hover,
  .ds-tabs__add:hover {
    background: var(--color-neutral-alpha-n2);
    color: var(--color-ds-primary-hover);
  }

  .ds-tabs__close svg,
  .ds-tabs__add svg {
    display: block;
    height: 16px;
    width: 16px;
  }

  .ds-tabs__close:focus-visible,
  .ds-tabs__add:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-tabs__panel {
    min-width: 0;
  }

  .ds-tabs[data-placement="end"] .ds-tabs__panel {
    order: 1;
  }

  .ds-tabs[data-type="card"] {
    gap: 0;
  }

  .ds-tabs[data-type="card"] .ds-tabs__nav {
    border-block-end: var(--ds-border-width-default) solid var(--color-ds-border);
  }

  .ds-tabs[data-type="card"] .ds-tabs__list {
    gap: var(--spacing-ds-1);
  }

  .ds-tabs[data-type="card"] .ds-tabs__tab-item {
    background: var(--color-neutral-alpha-n1);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-end-start-radius: 0;
    border-end-end-radius: 0;
    border-radius: var(--radius-ds-sm) var(--radius-ds-sm) 0 0;
    margin-block-end: calc(var(--ds-border-width-default) * -1);
  }

  .ds-tabs[data-type="card"] .ds-tabs__tab {
    padding: 0 var(--spacing-ds-3);
  }

  .ds-tabs[data-type="card"] .ds-tabs__tab::after {
    display: none;
  }

  .ds-tabs[data-type="card"] .ds-tabs__tab-item[data-active="true"] {
    background: var(--color-ds-surface);
    border-block-end-color: var(--color-ds-surface);
  }

  .ds-tabs[data-type="card"] .ds-tabs__tab-item[data-disabled="true"] {
    background: var(--color-neutral-alpha-n1);
  }

  .ds-tabs[data-type="card"] .ds-tabs__add {
    background: var(--color-neutral-alpha-n1);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm) var(--radius-ds-sm) 0 0;
    margin-block-end: calc(var(--ds-border-width-default) * -1);
  }

  .ds-tabs[data-type="card"] .ds-tabs__panel {
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-block-start: 0;
    border-radius: 0 0 var(--radius-ds-sm) var(--radius-ds-sm);
    padding: var(--spacing-ds-5);
  }
`;
