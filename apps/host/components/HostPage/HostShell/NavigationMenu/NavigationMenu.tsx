import NavigationMenuView from "./NavigationMenu.view";
import type { NavigationMenuProps } from "./NavigationMenu.types";

function NavigationMenu(props: NavigationMenuProps) {
  return <NavigationMenuView {...props} />;
}

export default NavigationMenu;
