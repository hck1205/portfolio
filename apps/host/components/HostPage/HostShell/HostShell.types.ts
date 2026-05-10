import type { ReactNode, RefObject } from "react";

import type { ActiveNav, NavigationItem } from "../../../lib/navigation";

export type HostShellProps = {
  activeNav: ActiveNav;
  children: ReactNode;
  navigationItems: NavigationItem[];
  onActiveNavChange: (activeNav: ActiveNav) => void;
};

export type HostShellController = {
  handleActiveNavChange: (activeNav: ActiveNav) => void;
  handleCollapseToggle: () => void;
  isAccountProfileTextVisible: boolean;
  isMenuReady: boolean;
  isSiderCollapsed: boolean;
  menuRef: RefObject<HTMLElement | null>;
  siderRef: RefObject<HTMLElement | null>;
};

export type HostShellViewProps = Omit<HostShellProps, "onActiveNavChange"> &
  HostShellController;
