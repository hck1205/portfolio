export type AnchorDirection = "vertical" | "horizontal";

export type AnchorChangeDetail = {
  href: string;
  previousHref: string;
};

export type AnchorClickDetail = {
  href: string;
  nativeEvent: MouseEvent;
};
