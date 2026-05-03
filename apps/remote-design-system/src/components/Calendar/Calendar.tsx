import dayjs, { type Dayjs } from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";

import { defineDsSelect } from "../Select/registration/defineDsSelect";
import {
  CALENDAR_CHANGE_EVENT,
  CALENDAR_OBSERVED_ATTRIBUTES,
  CALENDAR_PANEL_CHANGE_EVENT,
  CALENDAR_SELECT_EVENT
} from "./constants/Calendar.constants";
import {
  formatCalendarValue,
  getCalendarMode,
  getMonthCells,
  getWeekNumber,
  getYearCells,
  indexCalendarNotices,
  normalizeCalendarNotices,
  normalizeBooleanAttribute,
  parseCalendarDate,
  parseCalendarNotices
} from "./dom/Calendar.dom";
import { createCalendarHeader, createDateNotices, createMonthNotice } from "./render/Calendar.render";
import { applyCalendarStyles } from "./Calendar.styles";
import type {
  CalendarChangeDetail,
  CalendarMode,
  CalendarNotice,
  CalendarPanelChangeDetail,
  CalendarSelectDetail
} from "./types/Calendar.types";

dayjs.extend(dayOfYear);

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export class DsCalendar extends HTMLElement {
  static observedAttributes = CALENDAR_OBSERVED_ATTRIBUTES;

  private hasAppliedDefaultValue = false;
  private internalValue = dayjs();
  private internalNotices: CalendarNotice[] = [];
  private noticeIndexes = indexCalendarNotices([]);
  private rootElement?: HTMLDivElement;
  private viewDate = dayjs();

  connectedCallback() {
    defineDsSelect();
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    if (name === "value") {
      this.internalValue = parseCalendarDate(newValue, this.internalValue);
      this.viewDate = this.internalValue;
    }

    if (name === "notices") {
      this.setNotices(parseCalendarNotices(newValue), false);
    }

    this.render();
  }

  get defaultValue() {
    return this.getAttribute("default-value") ?? "";
  }

  set defaultValue(value: string) {
    this.setAttribute("default-value", value);
  }

  get fullscreen() {
    return normalizeBooleanAttribute(this, "fullscreen", true);
  }

  set fullscreen(value: boolean) {
    this.setAttribute("fullscreen", String(value));
  }

  get mode(): CalendarMode {
    return getCalendarMode(this);
  }

  set mode(value: CalendarMode) {
    this.setAttribute("mode", value);
  }

  get notices() {
    return this.internalNotices;
  }

  set notices(value: CalendarNotice[]) {
    this.setNotices(normalizeCalendarNotices(value));
  }

  private setNotices(notices: CalendarNotice[], shouldRender = true) {
    this.internalNotices = notices;
    this.noticeIndexes = indexCalendarNotices(notices);

    if (shouldRender) {
      this.render();
    }
  }

  private getDateNotices(date: Dayjs) {
    return this.noticeIndexes.dateNotices.get(date.format("YYYY-MM-DD"));
  }

  private getMonthNotice(month: Dayjs) {
    return this.noticeIndexes.monthNotices.get(month.format("YYYY-MM"));
  }

  private createHeader() {
    return createCalendarHeader({
      mode: this.mode,
      onModeChange: (mode) => this.setMode(mode),
      onPanelDateChange: (value) => this.setPanelDate(value),
      viewDate: this.viewDate
    });
  }

  private setPanelDate(value: Dayjs) {
    if (!value.isValid()) {
      return;
    }

    this.viewDate = value;
    this.dispatchPanelChange();
    this.render();
  }

  get showWeek() {
    return normalizeBooleanAttribute(this, "show-week", false);
  }

  set showWeek(value: boolean) {
    this.setAttribute("show-week", String(value));
  }

  get value() {
    if (this.hasAttribute("value")) {
      return parseCalendarDate(this.getAttribute("value"), this.internalValue);
    }

    return this.internalValue;
  }

  set value(value: Dayjs | string) {
    this.setValue(typeof value === "string" ? dayjs(value) : value, true, "date");
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    this.applyDefaultValue();

    if (!this.rootElement) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.rootElement = document.createElement("div");
      this.rootElement.className = "ds-calendar";
      shadowRoot.replaceChildren(this.rootElement);
      applyCalendarStyles(shadowRoot);
    }

    this.setAttributeIfChanged("mode", this.mode);
    this.setAttributeIfChanged("fullscreen", String(this.fullscreen));
    this.rootElement.replaceChildren(this.createHeader(), this.mode === "year" ? this.createYearPanel() : this.createMonthPanel());
  }

  private createMonthPanel() {
    const fragment = document.createDocumentFragment();
    const weekdays = document.createElement("div");
    const grid = document.createElement("div");
    const cells = getMonthCells(this.viewDate);

    weekdays.className = "ds-calendar__weekdays";
    weekdays.dataset.showWeek = String(this.showWeek);
    grid.className = "ds-calendar__grid";
    grid.dataset.showWeek = String(this.showWeek);

    if (this.showWeek) {
      weekdays.append(this.createWeekday("Wk"));
    }

    weekdays.append(...WEEKDAYS.map((weekday) => this.createWeekday(weekday)));

    for (let index = 0; index < cells.length; index += 7) {
      const row = cells.slice(index, index + 7);

      if (this.showWeek) {
        grid.append(this.createWeek(row[0]));
      }

      grid.append(...row.map((date) => this.createDateCell(date)));
    }

    fragment.append(weekdays, grid);

    return fragment;
  }

  private createYearPanel() {
    const months = document.createElement("div");

    months.className = "ds-calendar__months";
    months.append(...getYearCells(this.viewDate).map((month) => this.createMonthCell(month)));

    return months;
  }

  private createDateCell(date: Dayjs) {
    const cell = document.createElement("button");
    const inner = document.createElement("span");

    cell.className = "ds-calendar__cell";
    cell.type = "button";
    cell.dataset.outside = String(!date.isSame(this.viewDate, "month"));
    cell.dataset.selected = String(date.isSame(this.value, "day"));
    cell.dataset.today = String(date.isSame(dayjs(), "day"));
    cell.addEventListener("click", () => this.setValue(date, true, "date"));
    inner.className = "ds-calendar__date";
    inner.textContent = date.format("DD");
    cell.append(inner);

    const notices = createDateNotices(this.getDateNotices(date));

    if (notices) {
      cell.append(notices);
    }

    return cell;
  }

  private createMonthCell(month: Dayjs) {
    const cell = document.createElement("button");
    const label = document.createElement("span");

    cell.className = "ds-calendar__month";
    cell.type = "button";
    cell.dataset.selected = String(month.isSame(this.value, "month"));
    label.className = "ds-calendar__month-label";
    label.textContent = month.format("MMM");
    cell.append(label);

    const notice = createMonthNotice(this.getMonthNotice(month));

    if (notice) {
      cell.append(notice);
    }

    cell.addEventListener("click", () => {
      this.viewDate = this.viewDate.month(month.month());
      this.setMode("month");
      this.dispatchSelect(this.viewDate, "month");
    });

    return cell;
  }

  private createWeekday(label: string) {
    const weekday = document.createElement("div");

    weekday.className = "ds-calendar__weekday";
    weekday.textContent = label;

    return weekday;
  }

  private createWeek(date: Dayjs) {
    const week = document.createElement("div");

    week.className = "ds-calendar__week";
    week.textContent = String(getWeekNumber(date)).padStart(2, "0");

    return week;
  }

  private setMode(mode: CalendarMode) {
    if (this.mode === mode) {
      return;
    }

    this.setAttribute("mode", mode);
    this.dispatchPanelChange(mode);
  }

  private setValue(value: Dayjs, shouldNotify: boolean, source: CalendarSelectDetail["source"]) {
    const nextValue = value.isValid() ? value : dayjs();

    this.internalValue = nextValue;
    this.viewDate = nextValue;

    if (this.hasAttribute("value")) {
      this.setAttribute("value", formatCalendarValue(nextValue));
    }

    if (shouldNotify) {
      this.dispatchChange(nextValue);
      this.dispatchSelect(nextValue, source);
    }

    this.render();
  }

  private applyDefaultValue() {
    if (this.hasAppliedDefaultValue || this.hasAttribute("value")) {
      return;
    }

    const defaultValue = this.defaultValue;

    if (defaultValue) {
      this.internalValue = parseCalendarDate(defaultValue, this.internalValue);
      this.viewDate = this.internalValue;
    }

    this.hasAppliedDefaultValue = true;
  }

  private dispatchChange(value: Dayjs) {
    this.dispatchEvent(
      new CustomEvent<CalendarChangeDetail>(CALENDAR_CHANGE_EVENT, {
        bubbles: true,
        detail: { value: formatCalendarValue(value) }
      })
    );
  }

  private dispatchPanelChange(mode = this.mode) {
    this.dispatchEvent(
      new CustomEvent<CalendarPanelChangeDetail>(CALENDAR_PANEL_CHANGE_EVENT, {
        bubbles: true,
        detail: { mode, value: formatCalendarValue(this.viewDate) }
      })
    );
  }

  private dispatchSelect(value: Dayjs, source: CalendarSelectDetail["source"]) {
    this.dispatchEvent(
      new CustomEvent<CalendarSelectDetail>(CALENDAR_SELECT_EVENT, {
        bubbles: true,
        detail: { source, value: formatCalendarValue(value) }
      })
    );
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
