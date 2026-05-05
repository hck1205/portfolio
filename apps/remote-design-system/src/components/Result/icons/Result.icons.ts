import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  createElement as createLucideElement
} from "lucide";

import type { ResultStatus } from "../types/Result.types";

type HttpResultStatus = Extract<ResultStatus, "403" | "404" | "500">;
type IconResultStatus = Exclude<ResultStatus, HttpResultStatus>;

const HTTP_STATUS_RESULTS = new Set<ResultStatus>(["403", "404", "500"]);
const RESULT_ICON_MAP = {
  error: CircleX,
  info: Info,
  success: CircleCheck,
  warning: CircleAlert
} satisfies Record<IconResultStatus, typeof CircleCheck>;

export function createResultIcon(status: ResultStatus) {
  if (isHttpResultStatus(status)) {
    return createStatusCodeIcon(status);
  }

  return createLucideElement(RESULT_ICON_MAP[status], {
    "aria-hidden": "true",
    focusable: "false",
    "stroke-width": 2
  });
}

function createStatusCodeIcon(status: HttpResultStatus) {
  const code = document.createElement("span");

  code.className = "ds-result__status-code";
  code.textContent = status;

  return code;
}

function isHttpResultStatus(status: ResultStatus): status is HttpResultStatus {
  return HTTP_STATUS_RESULTS.has(status);
}
