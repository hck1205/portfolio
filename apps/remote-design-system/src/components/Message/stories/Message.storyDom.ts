import type { MessageType } from "../types/Message.types";

export type MessageStoryArgs = {
  closable: boolean;
  content: string;
  duration: number;
  type: MessageType;
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

export function createMessage(args: MessageStoryArgs) {
  const message = document.createElement("ds-message");

  message.setAttribute("closable", String(args.closable));
  message.setAttribute("content", args.content);
  message.setAttribute("duration", "0");
  message.setAttribute("type", args.type);

  return message;
}

export function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-message-story-frame";
  frame.append(...children);

  return frame;
}

export function createRow(children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-message-story-row";
  row.append(...children);

  return row;
}

export function createMessageButton(label: string, onClick: () => void) {
  const button = document.createElement("button");

  button.className = "ds-message-story-button";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);

  return button;
}
