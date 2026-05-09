import { useEffect, useState } from "react";

import { navigationItems, type NavigationItem } from "../../../lib/navigation";
import { checkNavigationItemStatus } from "./navigationStatus.checker";
import {
  applyNavigationStatuses,
  createNavigationStatusById,
  getCheckableNavigationItems
} from "./navigationStatus.mapper";

/**
 * HostPage가 사용할 navigation 목록을 관리하고 landing 시점에 remote app 상태를 갱신합니다.
 *
 * 초기 렌더에서는 정적 navigation metadata를 사용하고, mount 이후 check URL이 있는 항목만
 * 비동기로 확인해 active/inactive 상태와 live 여부를 업데이트합니다.
 */
export function useNavigationStatus() {
  const [items, setItems] = useState<NavigationItem[]>(navigationItems);

  useEffect(() => {
    let mounted = true;
    const checkableItems = getCheckableNavigationItems(navigationItems);

    if (checkableItems.length === 0) {
      return undefined;
    }

    void Promise.all(checkableItems.map(checkNavigationItemStatus)).then(
      (statusEntries) => {
        if (!mounted) {
          return;
        }

        const statusById = createNavigationStatusById(statusEntries);

        setItems((currentItems) =>
          applyNavigationStatuses(currentItems, statusById)
        );
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  return items;
}
