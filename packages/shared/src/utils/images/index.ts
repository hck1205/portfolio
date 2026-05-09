export type SvgAttributeValue = string | number;
export type SvgAttributes = Record<string, SvgAttributeValue>;

export function normalizeSvgAttributes(attributes: SvgAttributes) {
  return Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => [
      key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()),
      value
    ])
  );
}
