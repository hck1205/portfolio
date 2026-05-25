import {
  SCREENSHOT_FILE_PREFIX,
  SCREENSHOT_MIME_TYPE
} from "./Screenshot.constants";

export function createScreenshotFilename(date = new Date()) {
  const timestamp = date
    .toISOString()
    .replace(/\.\d{3}Z$/, "")
    .replace(/[:T]/g, "-");

  return `${SCREENSHOT_FILE_PREFIX}-${timestamp}.png`;
}

export function downloadScreenshot(dataUrl: string) {
  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = createScreenshotFilename();
  link.rel = "noopener";
  link.click();
}

export function isPngDataUrl(value: string | null): value is string {
  return Boolean(value?.startsWith(`data:${SCREENSHOT_MIME_TYPE};base64,`));
}
