import { createDsButton } from "../../shared/stories/storyElements";
import { defaultEmptyStoryArgs } from "./Empty.storyData";
import type { EmptyStoryArgs } from "./Empty.storyTypes";

export function createEmpty(args: EmptyStoryArgs, actionText?: string) {
  const element = document.createElement("ds-empty");

  element.setAttribute("description", args.description);
  element.setAttribute("image", args.image);
  element.setAttribute("size", args.size);

  if (actionText) {
    element.append(createStoryButton(actionText));
  }

  return element;
}

export function createFrame(children: HTMLElement[], className = "") {
  const frame = document.createElement("div");

  frame.className = ["ds-empty-story-frame", className].filter(Boolean).join(" ");
  frame.append(...children);

  return frame;
}

export function createGrid(children: HTMLElement[]) {
  const grid = document.createElement("div");

  grid.className = "ds-empty-story-grid";
  grid.append(...children);

  return grid;
}

export function createPanel(child: HTMLElement) {
  const panel = document.createElement("div");

  panel.className = "ds-empty-story-panel";
  panel.append(child);

  return panel;
}

export function createComponentCase(title: string, child: HTMLElement, className = "") {
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  const body = document.createElement("div");

  section.className = ["ds-empty-story-component", className].filter(Boolean).join(" ");
  heading.className = "ds-empty-story-component-title";
  heading.textContent = title;
  body.className = "ds-empty-story-component-body";
  body.append(child);
  section.append(heading, body);

  return section;
}

export function createCompactEmpty(description: string) {
  return createEmpty({ ...defaultEmptyStoryArgs, description, image: "simple", size: "small" });
}

export function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

function createStoryButton(text: string) {
  const button = createDsButton({ label: text, type: "primary" });

  button.className = "ds-empty-story-button";

  return button;
}
