export const DESCRIPTIONS_STYLES = `
  :host {
    --ds-descriptions-column: 3;
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal);
    min-width: 0;
  }

  :host([hidden]) {
    display: none;
  }

  :host([size="small"]) {
    --ds-descriptions-cell-padding-block: var(--spacing-ds-2);
    --ds-descriptions-cell-padding-inline: var(--spacing-ds-3);
    --ds-descriptions-gap-block: var(--spacing-ds-3);
  }

  :host([size="middle"]) {
    --ds-descriptions-cell-padding-block: var(--spacing-ds-3);
    --ds-descriptions-cell-padding-inline: var(--spacing-ds-4);
    --ds-descriptions-gap-block: var(--spacing-ds-4);
  }

  :host([size="large"]) {
    --ds-descriptions-cell-padding-block: var(--spacing-ds-4);
    --ds-descriptions-cell-padding-inline: var(--spacing-ds-5);
    --ds-descriptions-gap-block: var(--spacing-ds-5);
  }

  .ds-descriptions {
    display: grid;
    gap: var(--spacing-ds-4);
    min-width: 0;
  }

  .ds-descriptions__header {
    align-items: center;
    display: flex;
    gap: var(--spacing-ds-4);
    justify-content: space-between;
    min-width: 0;
  }

  .ds-descriptions__header[hidden] {
    display: none;
  }

  .ds-descriptions__title-wrap {
    align-items: center;
    display: inline-flex;
    font-size: var(--text-ds-4);
    font-weight: var(--font-weight-ds-semibold, 600);
    gap: var(--spacing-ds-2);
    min-width: 0;
  }

  .ds-descriptions__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-descriptions__extra {
    align-items: center;
    color: var(--color-ds-text-secondary);
    display: inline-flex;
    flex: none;
    gap: var(--spacing-ds-2);
  }

  .ds-descriptions__body {
    display: grid;
    gap: var(--ds-descriptions-gap-block) var(--spacing-ds-5);
    grid-template-columns: repeat(var(--ds-descriptions-column), minmax(0, 1fr));
    min-width: 0;
  }

  :host([bordered]) .ds-descriptions__body {
    border: 1px solid var(--color-ds-border);
    border-radius: var(--radius-ds-2);
    gap: 0;
    overflow: hidden;
  }

  .ds-descriptions__items {
    display: contents;
  }

  ::slotted(ds-descriptions-item) {
    min-width: 0;
  }

  @media (max-width: 720px) {
    .ds-descriptions__body {
      grid-template-columns: 1fr;
    }
  }
`;

export const DESCRIPTIONS_ITEM_STYLES = `
  :host {
    --ds-descriptions-item-span: 1;
    display: block;
    grid-column: span var(--ds-descriptions-item-span);
    min-width: 0;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-descriptions-item {
    color: var(--color-ds-text);
    display: grid;
    gap: var(--spacing-ds-1) var(--spacing-ds-2);
    min-height: 100%;
    min-width: 0;
  }

  :host([layout="horizontal"]) .ds-descriptions-item {
    align-items: start;
    grid-template-columns: max-content minmax(0, 1fr);
  }

  :host([layout="vertical"]) .ds-descriptions-item {
    grid-template-columns: minmax(0, 1fr);
  }

  .ds-descriptions-item__label {
    color: var(--color-ds-text-secondary);
    font-weight: var(--font-weight-ds-regular, 400);
    min-width: 0;
  }

  .ds-descriptions-item__content {
    color: var(--color-ds-text);
    min-width: 0;
    overflow-wrap: anywhere;
  }

  :host([bordered]) {
    border-bottom: 1px solid var(--color-ds-border);
    border-inline-end: 1px solid var(--color-ds-border);
    margin-bottom: -1px;
    margin-inline-end: -1px;
  }

  :host([bordered]) .ds-descriptions-item {
    gap: 0;
    height: 100%;
  }

  :host([bordered][layout="horizontal"]) .ds-descriptions-item {
    grid-template-columns: minmax(112px, max-content) minmax(0, 1fr);
  }

  :host([bordered]) .ds-descriptions-item__label,
  :host([bordered]) .ds-descriptions-item__content {
    align-items: center;
    display: flex;
    min-height: 100%;
    padding: var(--ds-descriptions-cell-padding-block) var(--ds-descriptions-cell-padding-inline);
  }

  :host([bordered]) .ds-descriptions-item__label {
    background: var(--color-neutral-alpha-n2);
    border-inline-end: 1px solid var(--color-ds-border);
  }

  :host([bordered][layout="vertical"]) .ds-descriptions-item__label {
    border-bottom: 1px solid var(--color-ds-border);
    border-inline-end: 0;
  }

  :host([size="small"]) .ds-descriptions-item {
    font-size: var(--text-ds-1);
  }

  :host([size="large"]) .ds-descriptions-item {
    font-size: var(--text-ds-3);
  }
`;
