import { createDsButton } from "../../shared/stories/storyElements";
import type { PopconfirmStoryArgs } from "./Popconfirm.storyTypes";

export function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

export function createButton(label: string, danger = false) {
  const button = createDsButton({
    danger,
    label,
    type: danger ? "primary" : "default"
  });

  button.className = `ds-popconfirm-story-button${danger ? " ds-popconfirm-story-danger" : ""}`;

  return button;
}

export function createPopconfirm(args: PopconfirmStoryArgs, label = "삭제", danger = true) {
  const popconfirm = document.createElement("ds-popconfirm");

  popconfirm.setAttribute("title", args.title);
  popconfirm.setAttribute("description", args.description);
  popconfirm.setAttribute("placement", args.placement);
  popconfirm.append(createButton(label, danger));

  return popconfirm;
}

export function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-popconfirm-story-frame";
  frame.append(...children);

  return frame;
}
