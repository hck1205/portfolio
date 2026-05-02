export const TYPOGRAPHY_STYLES = `
  :host {
    display: inline;
    color: var(--color-ds-text);
    font-family: var(--font-sans);
  }

  :host([variant="title"]),
  :host([variant="paragraph"]) {
    display: block;
  }

  [hidden] {
    display: none !important;
  }

  .ds-typography {
    color: var(--ds-typography-custom-color, var(--ds-typography-color, var(--color-ds-text)));
    font-family: var(--font-sans);
    font-size: var(--ds-typography-size, var(--text-ds-3));
    font-weight: var(--ds-typography-weight, 400);
    letter-spacing: 0;
    line-height: var(--ds-typography-line-height, var(--leading-ds-readable));
    margin: 0;
    overflow-wrap: anywhere;
  }

  a.ds-typography {
    color: var(--color-ds-primary);
    text-decoration: none;
  }

  a.ds-typography:hover {
    color: var(--color-ds-primary-hover);
    text-decoration: underline;
  }

  a.ds-typography:focus-visible,
  .ds-typography__action:focus-visible,
  .ds-typography__editor:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  h1.ds-typography,
  h2.ds-typography,
  h3.ds-typography,
  h4.ds-typography,
  h5.ds-typography {
    color: var(--ds-typography-color, var(--color-ds-text));
    font-weight: var(--ds-typography-weight, var(--ds-font-weight-emphasis));
    line-height: var(--leading-ds-tight);
    margin-block: 1.2em 0.5em;
  }

  h1.ds-typography {
    font-size: var(--ds-typography-size, var(--text-ds-5));
  }

  h2.ds-typography,
  h3.ds-typography {
    font-size: var(--ds-typography-size, var(--text-ds-4));
  }

  h4.ds-typography,
  h5.ds-typography {
    font-size: var(--ds-typography-size, var(--text-ds-3));
  }

  p.ds-typography {
    display: block;
    margin-block: 0 1em;
  }

  :host([type="secondary"]) .ds-typography {
    --ds-typography-color: var(--color-ds-muted);
  }

  :host([type="success"]) .ds-typography {
    --ds-typography-color: var(--color-moss-solid-moss9);
  }

  :host([type="warning"]) .ds-typography {
    --ds-typography-color: var(--color-amber-solid-amber9);
  }

  :host([type="danger"]) .ds-typography {
    --ds-typography-color: var(--color-ds-danger);
  }

  :host([disabled]) .ds-typography {
    cursor: not-allowed;
    opacity: 0.48;
  }

  :host([strong]) .ds-typography {
    font-weight: var(--ds-font-weight-strong);
  }

  :host([italic]) .ds-typography {
    font-style: italic;
  }

  :host([underline]) .ds-typography {
    text-decoration-line: underline;
  }

  :host([delete]) .ds-typography {
    text-decoration-line: line-through;
  }

  :host([underline][delete]) .ds-typography {
    text-decoration-line: underline line-through;
  }

  :host([mark]) .ds-typography__content {
    background: var(--color-amber-alpha-amber3);
    border-radius: var(--radius-ds-sm);
    padding-inline: var(--spacing-ds-1);
  }

  :host([code]) .ds-typography__content {
    background: var(--color-ds-subtle-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 0.92em;
    padding: 0 var(--spacing-ds-1);
  }

  :host([keyboard]) .ds-typography__content {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-block-end-width: calc(var(--ds-border-width-default) * 2);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-1dp);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 0.88em;
    padding: 0 var(--spacing-ds-2);
  }

  :host([ellipsis]) .ds-typography__content {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--ds-typography-rows, 1);
    display: -webkit-box;
    overflow: hidden;
  }

  .ds-typography[data-text-overflow="truncate"] .ds-typography__content {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-typography[data-text-overflow="break"] .ds-typography__content {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .ds-typography__main {
    min-width: 0;
  }

  .ds-typography__actions {
    display: inline-flex;
    gap: var(--spacing-ds-1);
    margin-inline-start: var(--spacing-ds-2);
    vertical-align: text-bottom;
  }

  .ds-typography__action {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: var(--spacing-ds-5);
    justify-content: center;
    padding: 0;
    width: var(--spacing-ds-5);
  }

  .ds-typography__action:hover {
    background: var(--color-ds-subtle-surface);
    color: var(--color-ds-primary);
  }

  :host([disabled]) .ds-typography__action {
    cursor: not-allowed;
    pointer-events: none;
  }

  .ds-typography__action svg {
    height: var(--ds-icon-size-md);
    width: var(--ds-icon-size-md);
  }

  .ds-typography__editor-wrap {
    display: grid;
    gap: var(--spacing-ds-2);
  }

  .ds-typography__editor {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-text);
    font-family: var(--font-sans);
    font-size: var(--text-ds-3);
    line-height: var(--leading-ds-readable);
    min-height: var(--spacing-l2);
    padding: var(--spacing-ds-3);
    resize: vertical;
  }

  .ds-typography__editor-actions {
    display: inline-flex;
    gap: var(--spacing-ds-2);
  }

  .ds-typography__editor-button {
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-text);
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    font-weight: var(--ds-font-weight-strong);
    padding: var(--spacing-ds-2) var(--spacing-ds-3);
  }

  .ds-typography__editor-button:hover {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }
`;
