type ThinScrollbarOptions = {
  color?: string;
  size?: string;
  trackColor?: string;
};

export function createThinScrollbarStyles(
  selector: string,
  {
    color = "var(--color-ds-border)",
    size = "0.25rem",
    trackColor = "transparent"
  }: ThinScrollbarOptions = {}
) {
  return `
  ${selector} {
    scrollbar-color: ${color} ${trackColor};
    scrollbar-width: thin;
  }

  ${selector}::-webkit-scrollbar {
    height: ${size};
    width: ${size};
  }

  ${selector}::-webkit-scrollbar-thumb {
    background: ${color};
    border-radius: var(--radius-full);
  }

  ${selector}::-webkit-scrollbar-track {
    background: ${trackColor};
  }
`;
}
