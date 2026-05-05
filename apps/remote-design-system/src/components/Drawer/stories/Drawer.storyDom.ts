import type { DrawerPlacement } from "../types/Drawer.types";
import { createDsButton } from "../../shared/stories/storyElements";

export type DrawerStoryArgs = {
  closable: boolean;
  mask: boolean;
  placement: DrawerPlacement;
  title: string;
};

export function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

export function createTrigger(label: string, drawer: HTMLElement) {
  const button = createStoryButton(label, "primary");

  button.addEventListener("ds-button-click", () => drawer.setAttribute("open", "true"));

  return button;
}

export function createStoryButton(label: string, variant: "primary" | "secondary" = "secondary") {
  const button = createDsButton({
    label,
    type: variant === "primary" ? "primary" : "default"
  });

  button.className = variant === "primary" ? "ds-drawer-story-button" : "ds-drawer-story-footer-button";

  return button;
}

export function createDrawer(
  args: DrawerStoryArgs,
  content = "선택한 항목의 상세 정보와 다음 작업을 이 영역에서 확인할 수 있습니다."
) {
  const drawer = document.createElement("ds-drawer");
  const body = document.createElement("div");

  drawer.setAttribute("title", args.title);
  drawer.setAttribute("placement", args.placement);
  drawer.setAttribute("closable", String(args.closable));
  drawer.setAttribute("mask", String(args.mask));
  body.className = "ds-drawer-story-content";
  body.innerHTML = `<strong>드로어 콘텐츠</strong><span>${content}</span>`;
  drawer.append(body);

  return drawer;
}

export function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-drawer-story-frame";
  frame.append(...children);

  return frame;
}
