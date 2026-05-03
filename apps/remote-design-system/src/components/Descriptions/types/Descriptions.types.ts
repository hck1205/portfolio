export type DescriptionsLayout = "horizontal" | "vertical";

export type DescriptionsSize = "large" | "middle" | "small";

export type DescriptionsItemConfig = {
  bordered: boolean;
  colon: boolean;
  layout: DescriptionsLayout;
  size: DescriptionsSize;
};
