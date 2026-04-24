const designSystemUrl = process.env.NEXT_PUBLIC_DESIGN_SYSTEM_URL ?? "http://localhost:6006";

export default function Page() {
  const navigationItems = [
    { label: "Overview", href: "#overview", state: "Ready" },
    { label: "Design System", href: "#design-system", state: "Live" }
  ];

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Portfolio navigation">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <div>
            <p className="brand-kicker">Portfolio</p>
            <h1>Shell</h1>
          </div>
        </div>

        <nav className="nav-list">
          {navigationItems.map((item) => (
            <a
              aria-current={item.label === "Design System" ? "page" : undefined}
              className="nav-item"
              href={item.href}
              key={item.label}
            >
              <span>{item.label}</span>
              <small>{item.state}</small>
            </a>
          ))}
        </nav>
      </aside>

      <section className="workspace" id="design-system">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Micro Frontend Remote</p>
            <h2>Design System Storybook</h2>
          </div>
          <a className="open-link" href={designSystemUrl} rel="noreferrer" target="_blank">
            Open
          </a>
        </header>

        <iframe
          className="storybook-frame"
          src={designSystemUrl}
          title="Portfolio design system Storybook"
        />
      </section>
    </main>
  );
}
