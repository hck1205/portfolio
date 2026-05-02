export const MENU_STYLES = `
  :host {
    display: block;
    font-family: var(--ds-font-family-interface, var(--font-family-interface));
    font-size: var(--font-size-control);
    line-height: var(--leading-ds-tight);
    max-width: 100%;
    min-width: 0;
  }

  :host([mode="horizontal"]) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: visible;
    scrollbar-width: thin;
  }

  :host([mode="horizontal"])::-webkit-scrollbar {
    height: 6px;
  }

  .ds-menu {
    background: var(--ds-menu-bg, var(--color-ds-surface));
    color: var(--ds-menu-color, var(--color-ds-text));
    display: flex;
    flex-direction: column;
    gap: var(--spacing-ds-1);
    list-style: none;
    margin: 0;
    min-width: 0;
    padding: var(--spacing-ds-1);
  }

  .ds-menu[data-mode="horizontal"] {
    align-items: center;
    border-bottom: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    flex-direction: row;
    overflow: visible;
    scrollbar-width: none;
    width: max-content;
    max-width: 100%;
  }

  .ds-menu[data-mode="horizontal"]::-webkit-scrollbar {
    display: none;
  }

  .ds-menu[data-collapsed="true"] {
    width: var(--ds-menu-collapsed-width, 80px);
  }

  .ds-menu[data-theme="dark"] {
    --ds-menu-bg: var(--color-neutral-solid-n9);
    --ds-menu-color: var(--color-neutral-solid-n2);
    --ds-menu-muted: var(--color-neutral-solid-n5);
    --ds-menu-hover-bg: rgba(255, 255, 255, 0.08);
    --ds-menu-selected-bg: var(--color-ds-primary);
    --ds-menu-selected-color: var(--color-neutral-static-light);
  }
`;

export const MENU_ITEM_STYLES = `
  :host {
    display: block;
    min-width: 0;
  }

  :host([data-menu-mode="horizontal"]) {
    flex: 0 0 auto;
    position: relative;
    white-space: nowrap;
  }

  .ds-menu-item {
    display: grid;
    min-width: 0;
  }

  .ds-menu-item__control {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: inherit;
    cursor: pointer;
    display: grid;
    font: inherit;
    gap: var(--spacing-ds-2);
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    line-height: var(--leading-ds-readable);
    min-height: var(--ds-menu-item-height, 38px);
    min-width: 0;
    padding: calc(var(--spacing-ds-2) + 1px) var(--spacing-ds-3);
    text-align: left;
    text-decoration: none;
    width: 100%;
  }

  :host([data-menu-mode="horizontal"]) .ds-menu-item__control {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    min-height: 40px;
    text-align: center;
  }

  :host([data-menu-mode="horizontal"]) .ds-menu-item__icon,
  :host([data-menu-mode="horizontal"]) .ds-menu-item__extra {
    display: none;
  }

  .ds-menu-item__control:hover,
  .ds-menu-item__control:focus-visible {
    background: var(--ds-menu-hover-bg, var(--color-neutral-alpha-n1));
    outline: none;
  }

  .ds-menu-item__control:focus-visible {
    box-shadow: inset 0 0 0 var(--ds-focus-ring-width) var(--color-ds-primary);
  }

  :host([data-selected]) .ds-menu-item__control {
    background: var(--ds-menu-selected-bg, var(--color-neutral-alpha-n2));
    color: var(--ds-menu-selected-color, var(--color-ds-primary));
    font-weight: var(--font-weight-ds-strong);
  }

  :host([danger]) .ds-menu-item__control {
    color: var(--color-ds-danger);
  }

  :host([disabled]) .ds-menu-item__control,
  :host([aria-disabled="true"]) .ds-menu-item__control {
    color: var(--ds-menu-muted, var(--color-neutral-alpha-n6));
    cursor: not-allowed;
  }

  .ds-menu-item__icon,
  .ds-menu-item__chevron {
    align-items: center;
    color: currentColor;
    display: inline-flex;
    height: var(--ds-icon-size-md);
    justify-content: center;
    width: var(--ds-icon-size-md);
  }

  .ds-menu-item__icon[hidden],
  .ds-menu-item__chevron[hidden],
  .ds-menu-item__extra[hidden] {
    display: none;
  }

  .ds-menu-item__label {
    line-height: var(--leading-ds-readable);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([data-menu-collapsed]) .ds-menu-item__label,
  :host([data-menu-collapsed]) .ds-menu-item__extra,
  :host([data-menu-collapsed]) .ds-menu-item__chevron,
  :host([data-menu-collapsed]) .ds-menu-item__children,
  :host([data-menu-collapsed]) .ds-menu-item__group-label {
    display: none;
  }

  :host([data-menu-collapsed]) .ds-menu-item__control {
    grid-template-columns: 1fr;
    justify-items: center;
    padding-inline: var(--spacing-ds-2);
  }

  .ds-menu-item__extra {
    color: var(--ds-menu-muted, var(--color-ds-muted));
    font-size: var(--font-size-caption);
  }

  .ds-menu-item__chevron {
    transition: transform 150ms ease-in-out;
  }

  :host([data-open]) .ds-menu-item__chevron {
    transform: rotate(90deg);
  }

  .ds-menu-item__children {
    display: grid;
    gap: var(--spacing-ds-1);
    margin-left: var(--ds-menu-inline-indent, var(--spacing-ds-6));
    min-width: 0;
  }

  .ds-menu-item__children[hidden] {
    display: none;
  }

  :host([data-menu-mode="horizontal"]) .ds-menu-item__children {
    background: var(--ds-menu-bg, var(--color-ds-surface));
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    margin-left: 0;
    min-width: var(--ds-menu-popup-width, 160px);
    padding: var(--spacing-ds-1);
    position: absolute;
    top: calc(100% + var(--spacing-ds-1));
    left: 0;
    z-index: var(--ds-menu-z-index, 1050);
  }

  :host([data-menu-mode="horizontal"]) .ds-menu-item__children[hidden] {
    display: none;
  }

  :host([data-menu-mode="horizontal"]) .ds-menu-item__children::slotted(ds-menu-item) {
    display: block;
    min-width: 100%;
  }

  .ds-menu-item__group-label {
    color: var(--ds-menu-muted, var(--color-ds-muted));
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-ds-strong);
    padding: var(--spacing-ds-2) var(--spacing-ds-3);
  }

  .ds-menu-item__divider {
    border: 0;
    border-top: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    margin: var(--spacing-ds-1) 0;
  }

  :host([data-type="divider"]) .ds-menu-item__control,
  :host([data-type="divider"]) .ds-menu-item__children,
  :host([data-type="divider"]) .ds-menu-item__group-label {
    display: none;
  }

  :host(:not([data-type="divider"])) .ds-menu-item__divider {
    display: none;
  }

  :host(:not([data-type="group"])) .ds-menu-item__group-label {
    display: none;
  }

  :host([data-type="group"]) .ds-menu-item__control {
    display: none;
  }
`;
