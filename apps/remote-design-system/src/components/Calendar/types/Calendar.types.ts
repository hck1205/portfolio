export type CalendarMode = "month" | "year";

export type CalendarNoticeType = "success" | "warning" | "error" | "info";

export type CalendarDateNotice = {
  content: string;
  date: string;
  type?: CalendarNoticeType;
};

export type CalendarMonthNotice = {
  count: number;
  label?: string;
  month: string;
};

export type CalendarNotice = CalendarDateNotice | CalendarMonthNotice;

export type CalendarChangeDetail = {
  value: string;
};

export type CalendarPanelChangeDetail = {
  mode: CalendarMode;
  value: string;
};

export type CalendarSelectDetail = {
  source: CalendarMode | "date";
  value: string;
};
