import {
  Apple,
  Bot,
  Chrome,
  Gauge,
  Plus,
  type IconNode,
  ShieldCheck,
  X,
  createElement as createLucideElement
} from "lucide";

const tabIcons = {
  apple: Apple,
  bot: Bot,
  chrome: Chrome,
  gauge: Gauge,
  shield: ShieldCheck
} as const satisfies Record<string, IconNode>;

export type TabIconName = keyof typeof tabIcons;

export function createTabIcon(name: string) {
  const icon = tabIcons[name as TabIconName];

  if (!icon) {
    return document.createTextNode(name);
  }

  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2
  });
}

export function createAddIcon() {
  return createActionIcon(Plus);
}

export function createCloseIcon() {
  return createActionIcon(X);
}

function createActionIcon(icon: IconNode) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2
  });
}
