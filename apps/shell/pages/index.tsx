import dynamic from "next/dynamic";
import { useState } from "react";

const storybookUrl =
  process.env.NEXT_PUBLIC_STORYBOOK_URL ?? "http://localhost:6006";

const AXApp = dynamic(() => import("ax/AXApp"), {
  ssr: false,
  loading: () => <div className="remote-fallback">Loading AX remote...</div>
});

type ActiveNav = "storybook" | "ax";

export default function Page() {
  const [activeNav, setActiveNav] = useState<ActiveNav>("storybook");

  return (
    <main className="shell">
      <aside className="shell-sidebar" aria-label="Portfolio navigation">
        <div className="shell-brand">
          <span className="shell-brand-mark" aria-hidden="true">
            P
          </span>
          <div>
            <p className="shell-brand-kicker">Portfolio</p>
            <h1>Shell</h1>
          </div>
        </div>

        <nav className="shell-nav">
          <button
            aria-current={activeNav === "storybook" ? "page" : undefined}
            className="shell-nav-item"
            onClick={() => setActiveNav("storybook")}
            type="button"
          >
            <span>Storybook</span>
            <small>App</small>
          </button>
          <button
            aria-current={activeNav === "ax" ? "page" : undefined}
            className="shell-nav-item"
            onClick={() => setActiveNav("ax")}
            type="button"
          >
            <span>AX</span>
            <small>AI Transformation</small>
          </button>
        </nav>
      </aside>

      <section className="shell-workspace">
        {activeNav === "storybook" ? (
          <iframe
            className="storybook-frame"
            src={storybookUrl}
            title="Storybook"
          />
        ) : (
          <AXApp />
        )}
      </section>
    </main>
  );
}
