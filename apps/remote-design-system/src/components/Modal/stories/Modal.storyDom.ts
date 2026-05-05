import { createDsButton } from "../../shared/stories/storyElements";
import type { ModalFooterActionOptions, ModalStoryArgs } from "./Modal.storyTypes";

const DEFAULT_CONTENT = "진행하기 전에 변경 내용을 확인해 주세요.";

export function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

export function createTrigger(label: string, modal: HTMLElement) {
  const button = createDsButton({ label, type: "primary" });

  button.addEventListener("ds-button-click", () => modal.setAttribute("open", "true"));

  return button;
}

export function createModal(args: ModalStoryArgs, content: Node | string = DEFAULT_CONTENT) {
  const modal = document.createElement("ds-modal");
  const body = document.createElement("div");

  modal.setAttribute("title", args.title);
  modal.setAttribute("centered", String(args.centered));
  modal.setAttribute("closable", String(args.closable));
  modal.setAttribute("mask", String(args.mask));
  body.className = "ds-modal-story-content";

  if (typeof content === "string") {
    body.append(createBasicContent(content));
  } else {
    body.append(content);
  }

  modal.append(body);

  return modal;
}

export function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-modal-story-frame";
  frame.append(...children);

  return frame;
}

export function appendFooterActions(modal: HTMLElement, actions: ModalFooterActionOptions) {
  const secondary = createFooterButton(
    actions.secondaryLabel,
    actions.secondaryClassName ?? "ds-modal-story-footer-button",
    modal
  );
  const primary = createFooterButton(actions.primaryLabel, actions.primaryClassName ?? "ds-modal-story-button", modal);

  modal.append(secondary, primary);
}

function createBasicContent(content: string) {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("strong");
  const description = document.createElement("span");

  title.textContent = "확인 내용";
  description.textContent = content;
  fragment.append(title, description);

  return fragment;
}

function createFooterButton(label: string, className: string, modal: HTMLElement) {
  const button = createDsButton({
    label,
    type: className.includes("footer") ? "default" : "primary"
  });

  button.className = className;
  button.slot = "footer";
  button.addEventListener("ds-button-click", () => modal.setAttribute("open", "false"));

  return button;
}
