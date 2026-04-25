import dynamic from 'next/dynamic';
import { useState } from 'react';

import { APP_ID } from '../components/LiveApp/LiveApp.const';
import { navigationItems, type ActiveNav } from '../lib/navigation';

const LiveApp = dynamic(() => import('../components/LiveApp/LiveApp'), {
  loading: () => <div className="remote-fallback">Loading app...</div>,
  ssr: false
});

const Overview = dynamic(() => import('../components/Overview'), {
  loading: () => <div className="remote-fallback">Loading overview...</div>
});

export default function Page() {
  const [activeNav, setActiveNav] = useState<ActiveNav>(APP_ID.OVERVIEW);
  const activeItem =
    navigationItems.find((item) => item.id === activeNav) ?? navigationItems[0];

  const renderApp = (activeItem: (typeof navigationItems)[number]) => {
    if (activeItem.id === APP_ID.OVERVIEW) {
      return <Overview />;
    }

    if (activeItem.live) {
      return <LiveApp id={activeItem.id} />;
    }

    return <div>not live</div>;
  };

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
          {navigationItems.map((item) => (
            <button
              aria-current={activeNav === item.id ? 'page' : undefined}
              className="shell-nav-item"
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              type="button"
            >
              <span>{item.label}</span>
              {item.id === APP_ID.OVERVIEW ? null : (
                <small>{item.live ? 'live' : 'not live'}</small>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <section className="shell-workspace">{renderApp(activeItem)}</section>
    </main>
  );
}
