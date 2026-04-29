import type { FoundationToken } from "../types";

export function tokenNameToCssVariable(prefix: string, tokenName: string): `--${string}` {
  const cssToken = tokenName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replaceAll("/", "-")
    .replaceAll(" ", "-");

  return `--${prefix}-${cssToken}`;
}

export function createToken(
  prefix: string,
  name: string,
  value: string,
  description: string
): FoundationToken {
  return {
    name,
    value,
    variable: tokenNameToCssVariable(prefix, name),
    description
  };
}
