import type { NavigationItem } from "../../../lib/navigation";
import type {
  NavigationStatusById,
  NavigationStatusEntry
} from "./navigationStatus.types";

/**
 * 실제 상태 확인이 필요한 navigation item만 추려냅니다.
 *
 * Overview처럼 로컬에서 항상 렌더링되는 항목이나 아직 remote URL이 없는 항목은 제외합니다.
 */
export function getCheckableNavigationItems(items: NavigationItem[]) {
  return items.filter((item) => item.statusCheckUrl);
}

/**
 * status check 결과 tuple 목록을 item id로 빠르게 조회할 수 있는 map 형태로 변환합니다.
 */
export function createNavigationStatusById(
  entries: NavigationStatusEntry[]
): NavigationStatusById {
  return Object.fromEntries(entries) as NavigationStatusById;
}

/**
 * 하나의 navigation item에 최신 status를 반영하고 live boolean을 status 기준으로 동기화합니다.
 */
export function applyNavigationStatus(
  item: NavigationItem,
  statusById: NavigationStatusById
): NavigationItem {
  const status = statusById[item.id] ?? item.status;

  return {
    ...item,
    live: status === "active",
    status
  };
}

/**
 * navigation item 목록 전체에 최신 remote status map을 적용합니다.
 */
export function applyNavigationStatuses(
  items: NavigationItem[],
  statusById: NavigationStatusById
) {
  return items.map((item) => applyNavigationStatus(item, statusById));
}
