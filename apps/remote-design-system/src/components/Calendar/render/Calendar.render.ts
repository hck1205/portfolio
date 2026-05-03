import type { Dayjs } from "dayjs";

import { SELECT_CHANGE_EVENT } from "../../Select/constants/Select.constants";
import type { SelectChangeDetail, SelectOption } from "../../Select/types/Select.types";
import type { CalendarDateNotice, CalendarMode, CalendarMonthNotice } from "../types/Calendar.types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type CreateCalendarHeaderOptions = {
  mode: CalendarMode;
  onModeChange: (mode: CalendarMode) => void;
  onPanelDateChange: (value: Dayjs) => void;
  viewDate: Dayjs;
};

export function createCalendarHeader({
  mode,
  onModeChange,
  onPanelDateChange,
  viewDate
}: CreateCalendarHeaderOptions) {
  const header = document.createElement("div");
  const selectors = document.createElement("div");
  const modeGroup = document.createElement("div");

  header.className = "ds-calendar__header";
  selectors.className = "ds-calendar__selectors";
  selectors.append(createYearSelect(viewDate, onPanelDateChange), createMonthSelect(viewDate, onPanelDateChange));
  modeGroup.className = "ds-calendar__mode";
  modeGroup.role = "radiogroup";
  modeGroup.setAttribute("aria-label", "Calendar panel mode");
  modeGroup.append(
    createModeOption({ activeMode: mode, label: "Month", mode: "month", onModeChange }),
    createModeOption({ activeMode: mode, label: "Year", mode: "year", onModeChange })
  );
  header.append(selectors, modeGroup);

  return header;
}

export function createDateNotices(notices: CalendarDateNotice[] | undefined) {
  if (!notices?.length) {
    return undefined;
  }

  const list = document.createElement("span");

  list.className = "ds-calendar__notices";
  list.role = "list";
  list.append(...notices.map(createDateNotice));

  return list;
}

export function createMonthNotice(notice: CalendarMonthNotice | undefined) {
  if (!notice) {
    return undefined;
  }

  const wrapper = document.createElement("span");
  const count = document.createElement("span");
  const label = document.createElement("span");

  wrapper.className = "ds-calendar__month-notice";
  count.className = "ds-calendar__month-count";
  count.textContent = String(notice.count);
  label.className = "ds-calendar__month-copy";
  label.textContent = notice.label ?? "누적 백로그";
  wrapper.append(count, label);

  return wrapper;
}

function createYearSelect(viewDate: Dayjs, onPanelDateChange: (value: Dayjs) => void) {
  const currentYear = viewDate.year();
  const options = Array.from({ length: 20 }, (_, index) => {
    const year = currentYear - 10 + index;

    return { label: String(year), value: String(year) };
  });
  const select = createSelect({
    ariaLabel: "Calendar year",
    options,
    value: String(currentYear)
  });

  select.addEventListener(SELECT_CHANGE_EVENT, (event) => {
    const { value } = (event as CustomEvent<SelectChangeDetail>).detail;

    onPanelDateChange(viewDate.year(Number(value)));
  });

  return select;
}

function createMonthSelect(viewDate: Dayjs, onPanelDateChange: (value: Dayjs) => void) {
  const select = createSelect({
    ariaLabel: "Calendar month",
    options: MONTHS.map((month, index) => ({ label: month, value: String(index) })),
    value: String(viewDate.month())
  });

  select.addEventListener(SELECT_CHANGE_EVENT, (event) => {
    const { value } = (event as CustomEvent<SelectChangeDetail>).detail;

    onPanelDateChange(viewDate.month(Number(value)));
  });

  return select;
}

function createSelect({
  ariaLabel,
  options,
  value
}: {
  ariaLabel: string;
  options: SelectOption[];
  value: string;
}) {
  const select = document.createElement("ds-select");

  select.className = "ds-calendar__select";
  select.setAttribute("aria-label", ariaLabel);
  select.setAttribute("options", JSON.stringify(options));
  select.setAttribute("placement", "bottomRight");
  select.setAttribute("size", "small");
  select.setAttribute("value", value);

  return select;
}

function createModeOption({
  activeMode,
  label,
  mode,
  onModeChange
}: {
  activeMode: CalendarMode;
  label: string;
  mode: CalendarMode;
  onModeChange: (mode: CalendarMode) => void;
}) {
  const button = document.createElement("button");
  const active = activeMode === mode;

  button.className = "ds-calendar__mode-option";
  button.type = "button";
  button.role = "radio";
  button.dataset.active = String(active);
  button.setAttribute("aria-checked", String(active));
  button.textContent = label;
  button.addEventListener("click", () => onModeChange(mode));

  return button;
}

function createDateNotice(notice: CalendarDateNotice) {
  const item = document.createElement("span");
  const marker = document.createElement("span");
  const content = document.createElement("span");

  item.className = "ds-calendar__notice";
  item.dataset.type = notice.type ?? "info";
  item.role = "listitem";
  marker.className = "ds-calendar__notice-marker";
  marker.setAttribute("aria-hidden", "true");
  content.className = "ds-calendar__notice-content";
  content.textContent = notice.content;
  item.append(marker, content);

  return item;
}
