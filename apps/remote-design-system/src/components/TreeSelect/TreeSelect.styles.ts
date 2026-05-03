export const TREE_SELECT_STYLES = `
  :host {
    --ds-tree-select-height: var(--spacing-m2);
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
    --ds-tree-select-height: var(--spacing-m1);
  }

  :host([size="large"]) {
    --ds-tree-select-height: var(--spacing-m3);
  }

  .ds-tree-select {
    color: var(--color-ds-text);
    display: inline-grid;
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal, 1.5);
    position: relative;
    width: 100%;
  }

  .ds-tree-select__field {
    align-items: center;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    cursor: pointer;
    display: grid;
    gap: var(--spacing-ds-2);
    grid-template-columns: minmax(0, 1fr) auto auto;
    min-height: var(--ds-tree-select-height);
    min-width: 13rem;
    padding: 0 var(--spacing-ds-2);
  }

  :host([variant="filled"]) .ds-tree-select__field {
    background: var(--color-ds-subtle-surface, var(--color-ds-surface-muted));
  }

  :host([variant="borderless"]) .ds-tree-select__field {
    border-color: transparent;
  }

  :host([variant="underlined"]) .ds-tree-select__field {
    border-color: transparent transparent var(--color-ds-border);
    border-radius: 0;
  }

  :host([status="error"]) .ds-tree-select__field {
    border-color: var(--color-ds-danger);
  }

  :host([status="warning"]) .ds-tree-select__field {
    border-color: var(--color-ds-warning);
  }

  .ds-tree-select__field:hover,
  .ds-tree-select__field:focus-within {
    border-color: var(--color-ds-primary);
  }

  .ds-tree-select__value {
    align-items: center;
    display: flex;
    gap: var(--spacing-ds-1);
    min-width: 0;
    overflow: hidden;
  }

  .ds-tree-select__selected-text {
    line-height: var(--leading-ds-normal, 1.5);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-tree-select__placeholder {
    color: var(--color-ds-muted);
  }

  .ds-tree-select__tag {
    align-items: center;
    background: var(--color-neutral-alpha-n2);
    border-radius: var(--radius-level1);
    display: inline-flex;
    gap: var(--spacing-ds-1);
    max-width: 7rem;
    min-height: 1.5em;
    overflow: hidden;
    padding: var(--spacing-ds-1);
    white-space: nowrap;
  }

  .ds-tree-select__tag-label {
    line-height: var(--leading-ds-normal, 1.5);
    min-width: 0;
    overflow: hidden;
    padding-inline-start: var(--spacing-ds-1);
    text-overflow: ellipsis;
  }

  .ds-tree-select__tag-remove {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-level1);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    flex: none;
    height: 16px;
    justify-content: center;
    padding: 0;
    width: 16px;
  }

  .ds-tree-select__tag-remove svg {
    display: block;
  }

  .ds-tree-select__tag-remove:hover {
    background: var(--color-neutral-alpha-n3);
    color: var(--color-ds-text);
  }

  .ds-tree-select__clear,
  .ds-tree-select__arrow {
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

  .ds-tree-select__popup {
    --ds-tree-select-popup-gap: var(--spacing-ds-2);
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-2);
    inset-block-start: calc(100% + var(--ds-tree-select-popup-gap));
    inset-inline-start: 0;
    min-width: 100%;
    padding: var(--spacing-ds-2);
    position: absolute;
    z-index: 20;
  }

  :host([placement="bottomRight"]) .ds-tree-select__popup,
  :host([placement="topRight"]) .ds-tree-select__popup {
    inset-inline-end: 0;
    inset-inline-start: auto;
  }

  :host([placement="topLeft"]) .ds-tree-select__popup,
  :host([placement="topRight"]) .ds-tree-select__popup {
    inset-block-end: calc(100% + var(--ds-tree-select-popup-gap));
    inset-block-start: auto;
  }

  .ds-tree-select__search {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-text);
    font: inherit;
    min-height: var(--spacing-m1);
    padding: 0 var(--spacing-ds-2);
  }

  .ds-tree-select__tree {
    display: grid;
    list-style: none;
    margin: 0;
    max-height: 16rem;
    overflow: auto;
    padding: 0;
  }

  .ds-tree-select__node {
    align-items: center;
    cursor: pointer;
    display: grid;
    gap: var(--spacing-ds-2);
    grid-template-columns: 18px minmax(0, 1fr);
    min-height: var(--spacing-m1);
    padding: 0 var(--spacing-ds-2);
  }

  .ds-tree-select__node[data-has-control="true"] {
    grid-template-columns: 18px auto minmax(0, 1fr);
  }

  .ds-tree-select__node:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
  }

  .ds-tree-select__switcher {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-level1);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: 18px;
    justify-content: center;
    padding: 0;
    width: 18px;
  }

  .ds-tree-select__switcher:disabled {
    cursor: default;
    opacity: 0;
  }

  .ds-tree-select__switcher svg {
    display: block;
  }

  .ds-tree-select__node > input {
    margin: 0;
  }

  .ds-tree-select__node[data-selected="true"] {
    background: var(--color-ds-primary-subtle, #e6f4ff);
    color: var(--color-ds-text);
  }

  .ds-tree-select__node[data-selected="true"]:hover {
    background: var(--color-ds-primary-subtle-hover, #d9ecff);
  }

  .ds-tree-select__node[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.56;
  }

  .ds-tree-select__node-label {
    line-height: var(--leading-ds-normal, 1.5);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-tree-select__empty {
    color: var(--color-ds-muted);
    padding: var(--spacing-ds-4);
    text-align: center;
  }

  :host([disabled]) .ds-tree-select {
    opacity: 0.64;
  }
`;

let treeSelectStyleSheet: CSSStyleSheet | undefined;

export function applyTreeSelectStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    treeSelectStyleSheet ??= new CSSStyleSheet();
    treeSelectStyleSheet.replaceSync(TREE_SELECT_STYLES);
    shadowRoot.adoptedStyleSheets = [treeSelectStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = TREE_SELECT_STYLES;
  shadowRoot.append(style);
}
