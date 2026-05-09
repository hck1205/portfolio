type PublicRuntimeEnv = {
  NEXT_PUBLIC_AX_REMOTE_URL?: string;
  NEXT_PUBLIC_DESIGN_SYSTEM_URL?: string;
  NEXT_PUBLIC_STORYBOOK_URL?: string;
};

declare const process:
  | {
      env: PublicRuntimeEnv;
    }
  | undefined;

export const defaultDesignSystemUrl = "http://localhost:6006";
export const defaultAxRemoteUrl = "http://localhost:3004";

function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function getAxRemoteUrl(env?: PublicRuntimeEnv) {
  return env?.NEXT_PUBLIC_AX_REMOTE_URL ?? defaultAxRemoteUrl;
}

export function getDesignSystemUrl(env?: PublicRuntimeEnv) {
  return (
    env?.NEXT_PUBLIC_DESIGN_SYSTEM_URL ??
    env?.NEXT_PUBLIC_STORYBOOK_URL ??
    defaultDesignSystemUrl
  );
}

const runtimeEnv = typeof process === "undefined" ? undefined : process.env;

export const axRemoteUrl = getAxRemoteUrl(runtimeEnv);
export const axRemoteEntryUrl = `${removeTrailingSlash(
  axRemoteUrl
)}/_next/static/chunks/remoteEntry.js`;
export const designSystemUrl = getDesignSystemUrl(runtimeEnv);
