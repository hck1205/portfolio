import type { Preview } from "@storybook/web-components-vite";
import "../src/styles.css";

const INDENT = "  ";

function formatAttribute({ name, value }: Attr, depth: number) {
  const indentation = INDENT.repeat(depth);

  return value === "" ? `${indentation}${name}` : `${indentation}${name}="${value}"`;
}

function formatElement(element: Element, depth: number): string {
  const indentation = INDENT.repeat(depth);
  const attributes = Array.from(element.attributes);
  const attributeBlock = attributes.length
    ? `\n${attributes.map((attribute) => formatAttribute(attribute, depth + 1)).join("\n")}\n${indentation}`
    : "";
  const openingTag = `${indentation}<${element.localName}${attributeBlock}>`;
  const children = Array.from(element.childNodes)
    .map((child) => formatNode(child, depth + 1))
    .filter(Boolean);

  if (children.length === 0) {
    return `${openingTag}</${element.localName}>`;
  }

  return `${openingTag}\n${children.join("\n")}\n${indentation}</${element.localName}>`;
}

function formatNode(node: ChildNode, depth: number): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent?.trim() ? `${INDENT.repeat(depth)}${node.textContent.trim()}` : "";
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    return formatElement(node as Element, depth);
  }

  return "";
}

function formatHtmlSource(source: string) {
  const trimmedSource = source.trim();

  if (!trimmedSource.startsWith("<")) {
    return source;
  }

  const template = document.createElement("template");
  template.innerHTML = trimmedSource;

  return Array.from(template.content.childNodes)
    .map((node) => formatNode(node, 0))
    .filter(Boolean)
    .join("\n");
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "centered",
    options: {
      storySort: {
        order: ["Components", "Icons", ["Lucide"], "Foundation", ["Tokens"]]
      }
    },
    docs: {
      source: {
        transform: formatHtmlSource
      }
    }
  }
};

export default preview;
