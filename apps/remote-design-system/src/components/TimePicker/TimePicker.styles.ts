import { createThinScrollbarStyles } from "../shared/styles/scrollbar";

export const TIME_PICKER_STYLES = `
  :host {
    --ds-time-picker-height: var(--spacing-m2);
    display: inline-block;
    font-family: var(--font-sans);
    max-width: 100%;
    position: relative;
    vertical-align: middle;
  }

  [hidden] {
    display: none !important;
  }

  :host([size="small"]) {
    --ds-time-picker-height: var(--spacing-m1);
  }

  :host([size="large"]) {
    --ds-time-picker-height: var(--spacing-m3);
  }

  .ds-time-picker {
    color: var(--color-ds-text);
    display: inline-grid;
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-tight);
    position: relative;
    width: 100%;
  }

  .ds-time-picker__field {
    align-items: center;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-2);
    grid-template-columns: minmax(0, 1fr) auto auto;
    min-height: var(--ds-time-picker-height);
    min-width: 11.5rem;
    padding: 0 var(--spacing-ds-2);
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out;
  }

  :host([variant="filled"]) .ds-time-picker__field {
    background: var(--color-ds-subtle-surface, var(--color-ds-surface-muted));
  }

  :host([variant="borderless"]) .ds-time-picker__field {
    border-color: transparent;
  }

  :host([variant="underlined"]) .ds-time-picker__field {
    border-color: transparent transparent var(--color-ds-border);
    border-radius: 0;
  }

  :host([status="error"]) .ds-time-picker__field {
    border-color: var(--color-ds-danger);
  }

  :host([status="warning"]) .ds-time-picker__field {
    border-color: var(--color-ds-warning);
  }

  .ds-time-picker__field:focus-within,
  .ds-time-picker__field:hover {
    border-color: var(--color-ds-primary);
  }

  .ds-time-picker__input {
    appearance: none;
    background: transparent;
    border: 0;
    color: var(--color-ds-text);
    font: inherit;
    min-width: 0;
    outline: 0;
    padding: 0;
  }

  .ds-time-picker__input::placeholder {
    color: var(--color-ds-muted);
  }

  .ds-time-picker__suffix {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
  }

  .ds-time-picker__clear {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-level1);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: var(--spacing-ds-6);
    justify-content: center;
    padding: 0;
    width: var(--spacing-ds-6);
  }

  .ds-time-picker__clear:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
    color: var(--color-ds-primary);
  }

  .ds-time-picker__clear:focus-visible,
  .ds-time-picker__option:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-time-picker__popup {
    --ds-time-picker-popup-gap: var(--spacing-ds-2);
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-3);
    inset-block-start: calc(100% + var(--ds-time-picker-popup-gap));
    inset-inline-start: 0;
    min-width: max-content;
    padding: var(--spacing-ds-1);
    position: absolute;
    z-index: 20;
  }

  :host([placement="bottomRight"]) .ds-time-picker__popup,
  :host([placement="topRight"]) .ds-time-picker__popup {
    inset-inline-end: 0;
    inset-inline-start: auto;
  }

  :host([placement="topLeft"]) .ds-time-picker__popup,
  :host([placement="topRight"]) .ds-time-picker__popup {
    inset-block-end: calc(100% + var(--ds-time-picker-popup-gap));
    inset-block-start: auto;
  }

  .ds-time-picker__columns {
    display: grid;
    gap: 0;
    grid-auto-columns: 40px;
    grid-auto-flow: column;
  }

  .ds-time-picker__column {
    display: grid;
    max-height: 12rem;
    overflow: auto;
    overscroll-behavior: contain;
  }

  ${createThinScrollbarStyles(".ds-time-picker__column")}

  .ds-time-picker__option,
  .ds-time-picker__now {
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-level1);
    color: var(--color-ds-text);
    cursor: pointer;
    font: inherit;
    min-height: var(--spacing-ds-7);
    padding: 0 var(--spacing-ds-1);
    text-align: center;
  }

  .ds-time-picker__option:hover,
  .ds-time-picker__now:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
  }

  .ds-time-picker__option[aria-selected="true"] {
    background: var(--color-ds-primary);
    color: var(--color-neutral-static-light);
  }

  .ds-time-picker__footer {
    border-block-start: var(--ds-border-width-default) solid var(--color-ds-border);
    display: flex;
    justify-content: flex-end;
    padding-block-start: var(--spacing-ds-2);
  }

  :host([disabled]) .ds-time-picker {
    opacity: 0.72;
  }

  :host([disabled]) .ds-time-picker__field {
    cursor: not-allowed;
  }
`;

let timePickerStyleSheet: CSSStyleSheet | undefined;

export function applyTimePickerStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    timePickerStyleSheet ??= new CSSStyleSheet();
    timePickerStyleSheet.replaceSync(TIME_PICKER_STYLES);
    shadowRoot.adoptedStyleSheets = [timePickerStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = TIME_PICKER_STYLES;
  shadowRoot.append(style);
}
