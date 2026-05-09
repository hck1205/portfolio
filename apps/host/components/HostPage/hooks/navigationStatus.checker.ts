import type { NavigationItem, NavigationStatus } from "../../../lib/navigation";
import { STATUS_CHECK_TIMEOUT_MS } from "./navigationStatus.constants";
import type { NavigationStatusEntry } from "./navigationStatus.types";

/**
 * 주어진 URL이 현재 브라우저에서 접근 가능한지 확인하고 navigation 상태 값으로 변환합니다.
 *
 * Cross-origin remote app은 CORS 정책 때문에 응답 status를 안정적으로 읽기 어렵기 때문에
 * `no-cors` 요청의 성공 여부를 "remote에 닿았다"는 신호로 사용합니다.
 */
export async function checkUrlStatus(url: string): Promise<NavigationStatus> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, STATUS_CHECK_TIMEOUT_MS);

  try {
    await fetch(url, {
      cache: "no-store",
      mode: "no-cors",
      signal: controller.signal
    });

    return "active";
  } catch {
    return "inactive";
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * 하나의 navigation item이 가진 status check URL을 검사해 item id와 상태를 tuple로 반환합니다.
 *
 * URL이 없는 item은 실제 remote 체크 대상이 아니므로 inactive로 간주합니다.
 */
export async function checkNavigationItemStatus(
  item: NavigationItem
): Promise<NavigationStatusEntry> {
  const statusCheckUrl = item.statusCheckUrl;

  if (!statusCheckUrl) {
    return [item.id, "inactive"];
  }

  return [item.id, await checkUrlStatus(statusCheckUrl)];
}
