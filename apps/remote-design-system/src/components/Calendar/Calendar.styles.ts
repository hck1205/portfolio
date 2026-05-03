export const CALENDAR_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
    max-width: 100%;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-calendar {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-3);
    max-width: 100%;
    min-width: 320px;
    padding: var(--spacing-ds-4);
  }

  :host([fullscreen="true"]) .ds-calendar {
    border-color: transparent;
    border-radius: 0;
    width: 100%;
  }

  .ds-calendar__header {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-ds-2);
    justify-content: space-between;
  }

  .ds-calendar__title {
    font-size: var(--text-ds-4);
    font-weight: var(--font-weight-ds-semibold, 600);
    line-height: var(--leading-ds-tight);
  }

  .ds-calendar__controls,
  .ds-calendar__mode {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-ds-1);
  }

  .ds-calendar__button {
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-level1);
    color: var(--color-ds-text);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    height: var(--spacing-m1);
    justify-content: center;
    min-width: var(--spacing-m1);
    padding: 0 var(--spacing-ds-2);
  }

  .ds-calendar__button:hover,
  .ds-calendar__button[data-active="true"] {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }

  .ds-calendar__button[data-active="true"] {
    background: var(--color-ds-primary-subtle, #e6f4ff);
  }

  .ds-calendar__weekdays,
  .ds-calendar__grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .ds-calendar__weekdays[data-show-week="true"],
  .ds-calendar__grid[data-show-week="true"] {
    grid-template-columns: 3rem repeat(7, minmax(0, 1fr));
  }

  .ds-calendar__weekday {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
    padding: var(--spacing-ds-2);
    text-align: center;
  }

  .ds-calendar__cell {
    appearance: none;
    background: transparent;
    border: 0;
    border-block-start: var(--ds-border-width-default) solid var(--color-ds-border);
    box-sizing: border-box;
    color: var(--color-ds-text);
    cursor: pointer;
    display: grid;
    font: inherit;
    min-height: 5rem;
    padding: var(--spacing-ds-2);
    text-align: start;
  }

  :host([fullscreen="false"]) .ds-calendar__cell {
    min-height: 2.75rem;
    place-items: center;
    text-align: center;
  }

  .ds-calendar__cell:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
  }

  .ds-calendar__cell[data-outside="true"] {
    color: var(--color-ds-muted);
  }

  .ds-calendar__cell[data-today="true"] .ds-calendar__date {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }

  .ds-calendar__cell[data-selected="true"] .ds-calendar__date {
    background: var(--color-ds-primary);
    border-color: var(--color-ds-primary);
    color: var(--color-white, #fff);
  }

  .ds-calendar__date {
    align-items: center;
    border: var(--ds-border-width-default) solid transparent;
    border-radius: var(--radius-full);
    display: inline-flex;
    height: 1.75rem;
    justify-content: center;
    justify-self: end;
    width: 1.75rem;
  }

  :host([fullscreen="false"]) .ds-calendar__date {
    justify-self: center;
  }

  .ds-calendar__week {
    align-items: center;
    border-block-start: var(--ds-border-width-default) solid var(--color-ds-border);
    color: var(--color-ds-muted);
    display: inline-flex;
    font-size: var(--text-ds-1);
    justify-content: center;
  }

  .ds-calendar__months {
    display: grid;
    gap: var(--spacing-ds-2);
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ds-calendar__month {
    appearance: none;
    background: transparent;
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-text);
    cursor: pointer;
    font: inherit;
    min-height: 5rem;
  }

  .ds-calendar__month:hover,
  .ds-calendar__month[data-selected="true"] {
    background: var(--color-ds-primary-subtle, #e6f4ff);
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }
`;

let calendarStyleSheet: CSSStyleSheet | undefined;

export function applyCalendarStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    calendarStyleSheet ??= new CSSStyleSheet();
    calendarStyleSheet.replaceSync(CALENDAR_STYLES);
    shadowRoot.adoptedStyleSheets = [calendarStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = CALENDAR_STYLES;
  shadowRoot.append(style);
}
