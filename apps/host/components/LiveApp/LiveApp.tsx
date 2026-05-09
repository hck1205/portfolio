import dynamic from "next/dynamic";

import { Fallback } from "../Fallback";
import { designSystemUrl } from "../../lib/urls";
import { APP_ID, type AppId } from "./LiveApp.const";
import { AppFrame } from "./LiveApp.styles";

const AXApp = dynamic(() => import("ax/AXApp"), {
  ssr: false,
  loading: () => <Fallback>Loading AX remote...</Fallback>
});

/**
 * 선택된 navigation id에 맞는 실제 live app을 렌더링합니다.
 */
function LiveApp({ id }: { id: AppId }) {
  switch (id) {
    case APP_ID.AX:
      return <AXApp />;
    case APP_ID.DESIGN_SYSTEM:
      return <AppFrame src={designSystemUrl} title="Design System" />;
    default:
      return <Fallback>Not live</Fallback>;
  }
}

export default LiveApp;
