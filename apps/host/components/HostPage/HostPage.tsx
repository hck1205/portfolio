import { useState } from "react";

import { APP_ID } from "../LiveApp/LiveApp.const";
import { type ActiveNav } from "../../lib/navigation";
import { useNavigationStatus } from "./hooks";
import HostPageView from "./HostPage.view";

function HostPage() {
  const navigationItems = useNavigationStatus();
  const [activeNav, setActiveNav] = useState<ActiveNav>(APP_ID.OVERVIEW);
  const activeItem =
    navigationItems.find((item) => item.id === activeNav) ?? navigationItems[0];

  return (
    <HostPageView
      activeItem={activeItem}
      activeNav={activeNav}
      navigationItems={navigationItems}
      onActiveNavChange={setActiveNav}
    />
  );
}

export default HostPage;
