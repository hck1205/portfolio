import type { NotificationPlacement, NotificationType } from "../types/Notification.types";

export type NotificationStoryArgs = {
  description: string;
  placement: NotificationPlacement;
  showProgress: boolean;
  title: string;
  type: NotificationType;
};
