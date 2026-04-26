import dynamic from "next/dynamic";

import { designSystemUrl } from "../../lib/urls";
import { APP_ID, type AppId } from "./LiveApp.const";

const AXApp = dynamic(() => import("ax/AXApp"), {
  ssr: false,
  loading: () => <div className="remote-fallback">Loading AX remote...</div>
});

export default function LiveApp({ id }: { id: AppId }) {
  switch (id) {
    case APP_ID.AX:
      return <AXApp />;
    case APP_ID.DESIGN_SYSTEM:
      return (
        <iframe
          className="app-frame"
          src={designSystemUrl}
          title="Design System"
        />
      );
    default:
      return <div>not live</div>;
  }
}
