export const ANCHOR_STYLES = `
  :host {
    display: block;
    color: var(--ds-anchor-color, var(--color-ds-muted));
    font-family: var(--ds-font-family-interface, var(--font-family-interface));
    font-size: var(--ds-anchor-font-size, var(--font-size-control));
    line-height: var(--ds-anchor-line-height, var(--leading-ds-tight));
  }

  .ds-anchor {
    display: block;
    min-width: 0;
  }

  .ds-anchor[data-direction="horizontal"] {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .ds-anchor[data-direction="horizontal"]::-webkit-scrollbar {
    display: none;
  }

  .ds-anchor__list {
    display: flex;
    flex-direction: column;
    gap: var(--ds-anchor-gap, 2px);
    min-width: 0;
  }

  .ds-anchor[data-direction="horizontal"] .ds-anchor__list {
    align-items: center;
    flex-direction: row;
    gap: var(--ds-anchor-horizontal-gap, var(--spacing-ds-2));
  }
`;

export const ANCHOR_LINK_STYLES = `
  :host {
    display: block;
    min-width: 0;
  }

  .ds-anchor-link {
    display: grid;
    min-width: 0;
  }

  .ds-anchor-link__control {
    align-items: center;
    border: 0;
    border-left: var(--ds-anchor-indicator-size, 2px) solid transparent;
    color: var(--ds-anchor-link-color, var(--color-ds-muted));
    display: flex;
    gap: var(--spacing-ds-2);
    min-height: var(--ds-anchor-link-min-height, 32px);
    min-width: 0;
    padding: var(--ds-anchor-link-padding, var(--spacing-ds-2) var(--spacing-ds-3));
    text-decoration: none;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      color 150ms ease-in-out;
  }

  .ds-anchor-link__control:hover {
    background: var(--ds-anchor-link-hover-bg, var(--color-neutral-alpha-n1));
    color: var(--ds-anchor-link-hover-color, var(--color-ds-text));
  }

  .ds-anchor-link__control:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  :host([data-active]) .ds-anchor-link__control {
    border-left-color: var(--ds-anchor-active-color, var(--color-ds-primary));
    color: var(--ds-anchor-active-color, var(--color-ds-primary));
    font-weight: var(--font-weight-ds-strong);
  }

  :host([disabled]) .ds-anchor-link__control,
  :host([aria-disabled="true"]) .ds-anchor-link__control {
    color: var(--color-neutral-alpha-n6);
    cursor: not-allowed;
  }

  .ds-anchor-link__label {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-anchor-link__children {
    display: grid;
    gap: var(--ds-anchor-gap, 2px);
    margin-left: var(--ds-anchor-nested-indent, var(--spacing-ds-4));
    min-width: 0;
  }

  :host([data-direction="horizontal"]) {
    display: inline-block;
  }

  :host([data-direction="horizontal"]) .ds-anchor-link__control {
    border-bottom: var(--ds-anchor-indicator-size, 2px) solid transparent;
    border-left: 0;
    padding-inline: var(--spacing-ds-3);
  }

  :host([data-direction="horizontal"][data-active]) .ds-anchor-link__control {
    border-bottom-color: var(--ds-anchor-active-color, var(--color-ds-primary));
  }

  :host([data-direction="horizontal"]) .ds-anchor-link__children {
    display: none;
  }
`;
