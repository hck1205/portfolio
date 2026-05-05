export type ModalOpenChangeDetail = {
  open: boolean;
  source: "api" | "cancel" | "close" | "escape" | "mask" | "ok";
};
