import type { ActiveNav, NavigationItem } from "../../lib/navigation";

export type HostPageViewProps = {
  activeItem: NavigationItem;
  activeNav: ActiveNav;
  navigationItems: NavigationItem[];
  onActiveNavChange: (activeNav: ActiveNav) => void;
};
