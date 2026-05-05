import type { FoundationToken } from "../types";

export const fontTokens = [
  {
    name: "FontFamily/Interface",
    value: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    variable: "--font-family-interface",
    description: "기본 인터페이스 글꼴 묶음"
  },
  {
    name: "FontSize/Caption",
    value: "12px",
    variable: "--font-size-caption",
    description: "좁은 공간의 label"
  },
  {
    name: "FontSize/Control",
    value: "14px",
    variable: "--font-size-control",
    description: "작은 control"
  },
  {
    name: "FontSize/Body",
    value: "15px",
    variable: "--font-size-body",
    description: "기본 컴포넌트 텍스트"
  },
  {
    name: "FontSize/Title",
    value: "24px",
    variable: "--font-size-title",
    description: "간결한 섹션 제목"
  }
] as const satisfies readonly FoundationToken[];
