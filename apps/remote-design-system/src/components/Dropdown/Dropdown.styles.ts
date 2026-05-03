export const DROPDOWN_STYLES = `
  :host {
    display: inline-block;
    font-family: var(--ds-font-family-interface, var(--font-family-interface));
    font-size: var(--ds-dropdown-font-size, var(--font-size-caption));
    line-height: var(--leading-ds-tight);
    position: relative;
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  .ds-dropdown {
    display: inline-block;
    position: relative;
  }

  .ds-dropdown__trigger {
    display: inline-flex;
  }

  .ds-dropdown__fallback-trigger {
    align-items: center;
    background: var(--ds-dropdown-trigger-background, var(--color-ds-surface));
    border: var(
      --ds-dropdown-trigger-border,
      var(--ds-border-width-default, 1px) solid var(--color-ds-border)
    );
    border-radius: var(--ds-dropdown-trigger-border-radius, var(--radius-ds-sm));
    block-size: var(--ds-dropdown-trigger-height, auto);
    box-sizing: border-box;
    color: var(--ds-dropdown-trigger-color, var(--color-ds-text));
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-weight: var(--ds-dropdown-trigger-font-weight, inherit);
    gap: var(--spacing-ds-2, var(--spacing-xs1));
    inline-size: var(--ds-dropdown-trigger-width, auto);
    justify-content: var(--ds-dropdown-trigger-justify-content, center);
    min-height: var(--ds-dropdown-trigger-min-height, 30px);
    padding: var(--ds-dropdown-trigger-padding, var(--spacing-ds-1) var(--spacing-ds-2));
  }

  .ds-dropdown__fallback-trigger-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-dropdown__trigger-icon {
    block-size: var(--ds-icon-size-sm, 14px);
    display: grid;
    flex: none;
    inline-size: var(--ds-icon-size-sm, 14px);
    line-height: 0;
    margin-inline-start: 2px;
    opacity: 0.72;
    place-items: center;
    transition: transform 150ms ease-in-out;
    transform-origin: center;
  }

  .ds-dropdown__trigger-icon svg {
    display: block;
    overflow: visible;
    transform-box: fill-box;
    transform-origin: center;
  }

  .ds-dropdown__fallback-trigger[aria-expanded="true"] .ds-dropdown__trigger-icon {
    transform: rotate(180deg);
  }

  .ds-dropdown__fallback-trigger:hover {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }

  .ds-dropdown__fallback-trigger:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-dropdown__popup {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    color: var(--color-ds-text);
    display: grid;
    gap: 2px;
    margin: 0;
    min-width: var(--ds-dropdown-min-width, 148px);
    padding: var(--ds-dropdown-padding, var(--spacing-ds-1));
    position: absolute;
    width: max-content;
    z-index: var(--ds-dropdown-z-index, 1050);
  }

  .ds-dropdown__popup[hidden] {
    display: none;
  }

  .ds-dropdown__popup[data-placement^="bottom"] {
    top: calc(100% + var(--spacing-ds-2));
  }

  .ds-dropdown__popup[data-placement^="top"] {
    bottom: calc(100% + var(--spacing-ds-2));
  }

  .ds-dropdown__popup[data-placement$="left"] {
    left: 0;
  }

  .ds-dropdown__popup[data-placement$="right"] {
    right: 0;
  }

  .ds-dropdown__popup[data-placement="bottom"],
  .ds-dropdown__popup[data-placement="top"] {
    left: 50%;
    transform: translateX(-50%);
  }

  .ds-dropdown__arrow {
    background: var(--color-ds-surface);
    border-left: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-top: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    display: block;
    height: 8px;
    position: absolute;
    transform: rotate(45deg);
    width: 8px;
  }

  .ds-dropdown__arrow[hidden] {
    display: none;
  }

  .ds-dropdown__popup[data-placement^="bottom"] .ds-dropdown__arrow {
    top: -5px;
  }

  .ds-dropdown__popup[data-placement^="top"] .ds-dropdown__arrow {
    bottom: -5px;
    transform: rotate(225deg);
  }

  .ds-dropdown__popup[data-placement$="left"] .ds-dropdown__arrow {
    left: var(--spacing-ds-4);
  }

  .ds-dropdown__popup[data-placement$="right"] .ds-dropdown__arrow {
    right: var(--spacing-ds-4);
  }

  .ds-dropdown__popup[data-placement="bottom"] .ds-dropdown__arrow,
  .ds-dropdown__popup[data-placement="top"] .ds-dropdown__arrow {
    left: calc(50% - 4px);
  }
`;

export const DROPDOWN_ITEM_STYLES = `
  :host {
    display: block;
    min-width: 0;
  }

  .ds-dropdown-item {
    display: block;
    min-width: 0;
  }

  .ds-dropdown-item__control {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    color: var(--color-ds-text);
    cursor: pointer;
    display: flex;
    font: inherit;
    gap: var(--spacing-ds-3);
    justify-content: space-between;
    min-height: 28px;
    min-width: 136px;
    padding: var(--spacing-ds-1) var(--spacing-ds-2);
    text-align: left;
    text-decoration: none;
    width: 100%;
  }

  .ds-dropdown-item__label-slot {
    flex: 1 1 auto;
    min-width: 0;
  }

  .ds-dropdown-item__control:hover,
  .ds-dropdown-item__control:focus-visible,
  :host([data-selected]) .ds-dropdown-item__control {
    background: var(--color-neutral-alpha-n1);
    color: var(--color-ds-primary);
    outline: none;
  }

  .ds-dropdown-item__control:focus-visible {
    box-shadow: inset 0 0 0 var(--ds-focus-ring-width) var(--color-ds-primary);
  }

  :host([danger]) .ds-dropdown-item__control {
    color: var(--color-ds-danger);
  }

  :host([disabled]) .ds-dropdown-item__control,
  :host([aria-disabled="true"]) .ds-dropdown-item__control {
    color: var(--color-neutral-alpha-n6);
    cursor: not-allowed;
  }

  .ds-dropdown-item__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-dropdown-item__shortcut {
    color: var(--color-ds-muted);
    flex: none;
    font-size: 11px;
    line-height: var(--leading-ds-tight);
  }

  .ds-dropdown-item__divider {
    border: 0;
    border-top: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    margin: var(--spacing-ds-1) 0;
  }

  :host([data-type="divider"]) .ds-dropdown-item__control {
    display: none;
  }

  :host(:not([data-type="divider"])) .ds-dropdown-item__divider {
    display: none;
  }
`;
