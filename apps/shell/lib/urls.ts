type PublicRuntimeEnv = {
  NEXT_PUBLIC_DESIGN_SYSTEM_URL?: string;
  NEXT_PUBLIC_STORYBOOK_URL?: string;
};

declare const process:
  | {
      env: PublicRuntimeEnv;
    }
  | undefined;

export const defaultDesignSystemUrl = "http://localhost:6006";

export function getDesignSystemUrl(env?: PublicRuntimeEnv) {
  return (
    env?.NEXT_PUBLIC_DESIGN_SYSTEM_URL ??
    env?.NEXT_PUBLIC_STORYBOOK_URL ??
    defaultDesignSystemUrl
  );
}

const runtimeEnv = typeof process === "undefined" ? undefined : process.env;

export const designSystemUrl = getDesignSystemUrl(runtimeEnv);
