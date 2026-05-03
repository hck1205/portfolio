export type CalendarMode = "month" | "year";

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
