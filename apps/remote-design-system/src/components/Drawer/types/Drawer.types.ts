export type DrawerPlacement = "bottom" | "left" | "right" | "top";

export type DrawerOpenChangeDetail = {
  open: boolean;
  source: "api" | "close" | "escape" | "mask";
};
