export const POPOVER_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal);
    position: relative;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-popover__trigger {
    display: inline-flex;
  }

  .ds-popover__popup {
    background: var(--color-ds-bg-elevated, var(--color-ds-bg-container));
    border: 1px solid var(--color-ds-border-secondary, var(--color-ds-border));
    border-radius: var(--radius-ds-2);
    box-shadow: var(--shadow-ds-lg, 0 8px 24px rgba(0, 0, 0, 0.14));
    box-sizing: border-box;
    color: var(--color-ds-text);
    display: grid;
    gap: var(--spacing-ds-2);
    min-width: 180px;
    opacity: 0;
    padding: var(--spacing-ds-3);
    pointer-events: none;
    position: absolute;
    transform: scale(0.98);
    transition:
      opacity 140ms ease-in-out,
      transform 140ms ease-in-out,
      visibility 140ms ease-in-out;
    visibility: hidden;
    width: max-content;
    max-width: min(320px, calc(100vw - 32px));
    z-index: var(--z-index-ds-popover, 1030);
  }

  .ds-popover__popup[data-open="true"] {
    opacity: 1;
    pointer-events: auto;
    transform: scale(1);
    visibility: visible;
  }

  .ds-popover__title {
    color: var(--color-ds-text);
    font-weight: var(--font-weight-ds-semibold, 600);
    min-width: 0;
  }

  .ds-popover__title:empty {
    display: none;
  }

  .ds-popover__content {
    color: var(--color-ds-text-secondary);
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .ds-popover__arrow {
    background: inherit;
    border: inherit;
    height: 10px;
    position: absolute;
    transform: rotate(45deg);
    width: 10px;
    z-index: -1;
  }

  .ds-popover__arrow[hidden] {
    display: none;
  }

  :host([placement^="top"]) .ds-popover__popup {
    bottom: calc(100% + 10px);
  }

  :host([placement^="bottom"]) .ds-popover__popup {
    top: calc(100% + 10px);
  }

  :host([placement^="left"]) .ds-popover__popup {
    right: calc(100% + 10px);
  }

  :host([placement^="right"]) .ds-popover__popup {
    left: calc(100% + 10px);
  }

  :host([placement="top"]) .ds-popover__popup,
  :host([placement="bottom"]) .ds-popover__popup {
    left: 50%;
    transform-origin: center;
    translate: -50% 0;
  }

  :host([placement="topLeft"]) .ds-popover__popup,
  :host([placement="bottomLeft"]) .ds-popover__popup {
    left: 0;
  }

  :host([placement="topRight"]) .ds-popover__popup,
  :host([placement="bottomRight"]) .ds-popover__popup {
    right: 0;
  }

  :host([placement="left"]) .ds-popover__popup,
  :host([placement="right"]) .ds-popover__popup {
    top: 50%;
    translate: 0 -50%;
  }

  :host([placement="leftTop"]) .ds-popover__popup,
  :host([placement="rightTop"]) .ds-popover__popup {
    top: 0;
  }

  :host([placement="leftBottom"]) .ds-popover__popup,
  :host([placement="rightBottom"]) .ds-popover__popup {
    bottom: 0;
  }

  :host([placement^="top"]) .ds-popover__arrow {
    bottom: -6px;
    left: calc(50% - 5px);
  }

  :host([placement^="bottom"]) .ds-popover__arrow {
    left: calc(50% - 5px);
    top: -6px;
  }

  :host([placement^="left"]) .ds-popover__arrow {
    right: -6px;
    top: calc(50% - 5px);
  }

  :host([placement^="right"]) .ds-popover__arrow {
    left: -6px;
    top: calc(50% - 5px);
  }
`;
