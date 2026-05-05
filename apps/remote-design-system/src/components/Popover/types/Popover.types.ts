export type PopoverPlacement =
  | "top"
  | "topLeft"
  | "topRight"
  | "bottom"
  | "bottomLeft"
  | "bottomRight"
  | "left"
  | "leftTop"
  | "leftBottom"
  | "right"
  | "rightTop"
  | "rightBottom";

export type PopoverTrigger = "hover" | "focus" | "click" | "contextMenu";

export type PopoverOpenChangeDetail = {
  open: boolean;
};
