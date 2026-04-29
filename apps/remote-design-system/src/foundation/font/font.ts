import type { FoundationToken } from "../types";

export const fontTokens = [
  {
    name: "FontFamily/Interface",
    value: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    variable: "--font-family-interface",
    description: "Default interface font stack"
  },
  {
    name: "FontSize/Caption",
    value: "12px",
    variable: "--font-size-caption",
    description: "Compact labels"
  },
  {
    name: "FontSize/Control",
    value: "14px",
    variable: "--font-size-control",
    description: "Small controls"
  },
  {
    name: "FontSize/Body",
    value: "15px",
    variable: "--font-size-body",
    description: "Default component text"
  },
  {
    name: "FontSize/Title",
    value: "24px",
    variable: "--font-size-title",
    description: "Compact section titles"
  }
] as const satisfies readonly FoundationToken[];
