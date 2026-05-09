import dynamic from "next/dynamic";

import { Fallback } from "../Fallback";
import { APP_ID } from "../LiveApp/LiveApp.const";
import { HostShell } from "./HostShell";
import type { HostPageViewProps } from "./HostPage.types";

const LiveApp = dynamic(() => import("../LiveApp/LiveApp"), {
  loading: () => <Fallback>Loading app...</Fallback>,
  ssr: false
});

const Overview = dynamic(() => import("../Overview"), {
  loading: () => <Fallback>Loading overview...</Fallback>
});

/**
 * 현재 선택된 navigation item의 상태에 따라 overview, live app, fallback 화면을 결정합니다.
 */
function renderActiveApp(activeItem: HostPageViewProps["activeItem"]) {
  if (activeItem.id === APP_ID.OVERVIEW) {
    return <Overview />;
  }

  if (activeItem.status === "unknown") {
    return <Fallback>Checking app status...</Fallback>;
  }

  if (activeItem.live) {
    return <LiveApp id={activeItem.id} />;
  }

  return <Fallback>Not live</Fallback>;
}

/**
 * Host shell에 navigation state와 active app content를 연결하는 HostPage의 view layer입니다.
 */
function HostPageView({
  activeItem,
  activeNav,
  navigationItems,
  onActiveNavChange
}: HostPageViewProps) {
  return (
    <HostShell
      activeNav={activeNav}
      navigationItems={navigationItems}
      onActiveNavChange={onActiveNavChange}
    >
      {renderActiveApp(activeItem)}
    </HostShell>
  );
}

export default HostPageView;
