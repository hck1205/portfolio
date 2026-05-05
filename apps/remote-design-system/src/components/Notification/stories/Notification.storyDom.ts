import { DsNotification } from "..";
import { createDsButton } from "../../shared/stories/storyElements";
import type { NotificationPlacement } from "../types/Notification.types";
import type { NotificationStoryArgs } from "./Notification.storyTypes";

export function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

export function createNotification(args: NotificationStoryArgs) {
  const notification = document.createElement("ds-notification");

  notification.setAttribute("title", args.title);
  notification.setAttribute("description", args.description);
  notification.setAttribute("type", args.type);
  notification.setAttribute("duration", "0");
  notification.setAttribute("placement", args.placement);
  notification.setAttribute("show-progress", String(args.showProgress));

  return notification;
}

export function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-notification-story-frame";
  frame.append(...children);

  return frame;
}

export function createButton(label: string, options: Parameters<typeof DsNotification.show>[0]) {
  const button = createDsButton({ label });

  button.className = "ds-notification-story-button";
  button.addEventListener("ds-button-click", () => DsNotification.show(options));

  return button;
}

export function createPlacementButtons(placements: NotificationPlacement[]) {
  const row = document.createElement("div");

  row.className = "ds-notification-story-row";
  row.append(
    ...placements.map((placement) =>
      createButton(placement, {
        description: "선택한 위치에서 표시되는 알림입니다.",
        placement,
        title: `${placement} 알림`
      })
    )
  );

  return row;
}

export function preventCloseButtonAction(notification: HTMLElement) {
  requestAnimationFrame(() => {
    const closeButton = notification.shadowRoot?.querySelector<HTMLButtonElement>('[part="close"]');

    closeButton?.addEventListener("click", preventClick, { capture: true });
  });
}

function preventClick(event: Event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
