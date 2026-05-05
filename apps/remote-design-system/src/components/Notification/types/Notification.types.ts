export type NotificationPlacement = "bottom" | "bottomLeft" | "bottomRight" | "top" | "topLeft" | "topRight";

export type NotificationType = "error" | "info" | "success" | "warning";

export type NotificationCloseDetail = {
  placement: NotificationPlacement;
  type: NotificationType;
};

export type NotificationShowOptions = {
  closable?: boolean;
  description: string;
  duration?: number;
  placement?: NotificationPlacement;
  showProgress?: boolean;
  title: string;
  type?: NotificationType;
};
