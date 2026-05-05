type AttributeValue = boolean | number | string | undefined;

export function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

export function setAttributes(element: HTMLElement, attributes: Record<string, AttributeValue>) {
  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined) {
      element.removeAttribute(name);
      continue;
    }

    if (typeof value === "boolean") {
      element.toggleAttribute(name, value);
      continue;
    }

    element.setAttribute(name, String(value));
  }
}

export function createStoryFrame(className: string, ...children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = className;
  frame.append(...children);

  return frame;
}

export function createStoryStack(className: string, ...children: HTMLElement[]) {
  const stack = document.createElement("div");

  stack.className = className;
  stack.append(...children);

  return stack;
}

export function createStorySection(className: string, titleClassName: string, title: string, ...children: HTMLElement[]) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");

  section.className = className;
  heading.className = titleClassName;
  heading.textContent = title;
  section.append(heading, ...children);

  return section;
}

export function createDsButton({
  danger = false,
  htmlType = "button",
  label,
  type = "default"
}: {
  danger?: boolean;
  htmlType?: "button" | "reset" | "submit";
  label: string;
  type?: "default" | "link" | "primary" | "text";
}) {
  const button = document.createElement("ds-button");

  setAttributes(button, {
    danger,
    "html-type": htmlType,
    type
  });
  button.textContent = label;

  return button;
}

export function createDsInput({
  mode = "input",
  name,
  placeholder = "",
  value = ""
}: {
  mode?: "input" | "password" | "textarea";
  name: string;
  placeholder?: string;
  value?: string;
}) {
  const input = document.createElement("ds-input");

  setAttributes(input, {
    block: true,
    mode,
    name,
    placeholder,
    value
  });

  return input;
}

export function createDsSelect({
  name,
  options,
  placeholder = "선택하세요",
  value
}: {
  name: string;
  options: Array<{ disabled?: boolean; label: string; value: string }>;
  placeholder?: string;
  value?: string;
}) {
  const select = document.createElement("ds-select");

  setAttributes(select, {
    name,
    options: JSON.stringify(options),
    placeholder,
    value
  });

  return select;
}
