import { useCallback, useEffect, useRef, useState } from "react";

import { navigationItems, type ActiveNav } from "../../../../lib/navigation";
import type { HostShellController, HostShellProps } from "../HostShell.types";

type UseHostShellOptions = Pick<HostShellProps, "activeNav" | "onActiveNavChange">;
type DsMenuElement = HTMLElement & {
  selectedKeys: string[];
};

function isDsMenuElement(element: HTMLElement): element is DsMenuElement {
  return "selectedKeys" in element;
}

export function useHostShell({
  activeNav,
  onActiveNavChange
}: UseHostShellOptions): HostShellController {
  const [isAccountProfileTextVisible, setIsAccountProfileTextVisible] =
    useState(true);
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);
  const accountProfileTextDelayRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const hasSyncedSiderRef = useRef(false);
  const menuRef = useRef<HTMLElement | null>(null);
  const siderRef = useRef<HTMLElement | null>(null);
  const handleActiveNavChange = useCallback(
    (activeNav: ActiveNav) => {
      onActiveNavChange(activeNav);
    },
    [onActiveNavChange]
  );
  const syncActiveMenuState = useCallback(() => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    menu.setAttribute("selected-keys", activeNav);

    if (isDsMenuElement(menu)) {
      menu.selectedKeys = [activeNav];
    }

    for (const item of menu.querySelectorAll<HTMLElement>("ds-menu-item")) {
      item.toggleAttribute(
        "data-selected",
        item.getAttribute("item-key") === activeNav
      );
    }
  }, [activeNav]);

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu) {
      return undefined;
    }

    const handleSelect = (event: Event) => {
      const { key } = (event as CustomEvent<{ key: ActiveNav }>).detail;
      const nextItem = navigationItems.find((item) => item.id === key);

      if (nextItem) {
        handleActiveNavChange(nextItem.id);
      }
    };

    menu.addEventListener("ds-menu-select", handleSelect);

    return () => {
      menu.removeEventListener("ds-menu-select", handleSelect);
    };
  }, [handleActiveNavChange]);

  useEffect(() => {
    syncActiveMenuState();

    const frameId = window.requestAnimationFrame(syncActiveMenuState);

    void customElements.whenDefined("ds-menu").then(syncActiveMenuState);
    void customElements.whenDefined("ds-menu-item").then(syncActiveMenuState);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [syncActiveMenuState]);

  useEffect(() => {
    const sider = siderRef.current;

    if (!sider) {
      return undefined;
    }

    const syncCollapsedState = () => {
      const collapsed = sider.hasAttribute("collapsed");

      if (accountProfileTextDelayRef.current) {
        clearTimeout(accountProfileTextDelayRef.current);
      }

      setIsSiderCollapsed(collapsed);

      if (collapsed) {
        setIsAccountProfileTextVisible(false);
      } else if (hasSyncedSiderRef.current) {
        setIsAccountProfileTextVisible(false);
        accountProfileTextDelayRef.current = setTimeout(() => {
          setIsAccountProfileTextVisible(true);
        }, 190);
      } else {
        setIsAccountProfileTextVisible(true);
      }

      hasSyncedSiderRef.current = true;
    };
    const observer = new MutationObserver(syncCollapsedState);

    syncCollapsedState();
    observer.observe(sider, {
      attributeFilter: ["collapsed"],
      attributes: true
    });

    return () => {
      if (accountProfileTextDelayRef.current) {
        clearTimeout(accountProfileTextDelayRef.current);
      }

      observer.disconnect();
    };
  }, []);

  const handleCollapseToggle = () => {
    const sider = siderRef.current;

    if (!sider) {
      return;
    }

    sider.toggleAttribute("collapsed", !sider.hasAttribute("collapsed"));
  };

  return {
    handleActiveNavChange,
    handleCollapseToggle,
    isAccountProfileTextVisible,
    isSiderCollapsed,
    menuRef,
    siderRef
  };
}
