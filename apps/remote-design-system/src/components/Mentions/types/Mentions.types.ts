export type MentionsPlacement = "bottom" | "top";

export type MentionsSize = "small" | "medium" | "large";

export type MentionsStatus = "error" | "warning";

export type MentionsVariant = "outlined" | "borderless" | "filled" | "underlined";

export type MentionOptionData = {
  disabled: boolean;
  label: string;
  value: string;
};

export type MentionSearchState = {
  prefix: string;
  query: string;
  start: number;
};

export type MentionsChangeDetail = {
  nativeEvent?: Event;
  value: string;
};

export type MentionsSearchDetail = MentionSearchState;

export type MentionsSelectDetail = {
  option: MentionOptionData;
  prefix: string;
  value: string;
};

export type MentionsClearDetail = {
  previousValue: string;
};
