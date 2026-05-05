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
    --ds-popover-surface: var(--color-ds-bg-elevated, var(--color-background-base, #fff));
    --ds-popover-border-color: var(--color-ds-border-secondary, var(--color-ds-border));
    background-color: var(--ds-popover-surface);
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
    --ds-popover-arrow-offset: 18px;
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
    background-color: var(--ds-popover-surface);
    border-color: var(--ds-popover-border-color);
    border-style: solid;
    border-width: 1px;
    height: 10px;
    pointer-events: none;
    position: absolute;
    transform: rotate(45deg);
    width: 10px;
    z-index: 0;
  }

  .ds-popover__arrow[hidden] {
    display: none;
  }

  :host([placement^="top"]) .ds-popover__popup {
    bottom: calc(100% + 10px);
  }

  :host([arrow="false"][placement^="top"]) .ds-popover__popup {
    bottom: calc(100% + 6px);
  }

  :host([placement^="bottom"]) .ds-popover__popup {
    top: calc(100% + 10px);
  }

  :host([arrow="false"][placement^="bottom"]) .ds-popover__popup {
    top: calc(100% + 6px);
  }

  :host([placement^="left"]) .ds-popover__popup {
    right: calc(100% + 10px);
  }

  :host([arrow="false"][placement^="left"]) .ds-popover__popup {
    right: calc(100% + 6px);
  }

  :host([placement^="right"]) .ds-popover__popup {
    left: calc(100% + 10px);
  }

  :host([arrow="false"][placement^="right"]) .ds-popover__popup {
    left: calc(100% + 6px);
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
    border-left: 0;
    border-top: 0;
    bottom: -6px;
    left: calc(50% - 5px);
  }

  :host([placement^="bottom"]) .ds-popover__arrow {
    border-bottom: 0;
    border-right: 0;
    left: calc(50% - 5px);
    top: -6px;
  }

  :host([placement^="left"]) .ds-popover__arrow {
    border-bottom: 0;
    border-left: 0;
    right: -6px;
    top: calc(50% - 5px);
  }

  :host([placement^="right"]) .ds-popover__arrow {
    border-right: 0;
    border-top: 0;
    left: -6px;
    top: calc(50% - 5px);
  }

  :host([placement="topLeft"]) .ds-popover__arrow,
  :host([placement="bottomLeft"]) .ds-popover__arrow {
    left: var(--ds-popover-arrow-offset);
  }

  :host([placement="topRight"]) .ds-popover__arrow,
  :host([placement="bottomRight"]) .ds-popover__arrow {
    left: auto;
    right: var(--ds-popover-arrow-offset);
  }

  :host([placement="leftTop"]) .ds-popover__arrow,
  :host([placement="rightTop"]) .ds-popover__arrow {
    top: var(--ds-popover-arrow-offset);
  }

  :host([placement="leftBottom"]) .ds-popover__arrow,
  :host([placement="rightBottom"]) .ds-popover__arrow {
    bottom: var(--ds-popover-arrow-offset);
    top: auto;
  }
`;
