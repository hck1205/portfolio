import dynamic from "next/dynamic";
import { useState } from "react";

const designSystemUrl =
  process.env.NEXT_PUBLIC_DESIGN_SYSTEM_URL ??
  process.env.NEXT_PUBLIC_STORYBOOK_URL ??
  "http://localhost:6006";

const AXApp = dynamic(() => import("ax/AXApp"), {
  ssr: false,
  loading: () => <div className="remote-fallback">Loading AX remote...</div>
});

type ActiveNav =
  | "overview"
  | "micro-frontend"
  | "ax"
  | "performance-optimization"
  | "design-system"
  | "graphics-integration"
  | "app";

const navigationItems: Array<{ id: ActiveNav; label: string; branch: string }> = [
  { id: "overview", label: "Overview", branch: "app/overview" },
  {
    id: "micro-frontend",
    label: "Micro Frontend",
    branch: "app/micro-frontend"
  },
  { id: "ax", label: "AX (AI Transformation)", branch: "app/ax-transformation" },
  {
    id: "performance-optimization",
    label: "Performance Optimization",
    branch: "app/performance-optimization"
  },
  { id: "design-system", label: "Design System", branch: "app/design-system" },
  {
    id: "graphics-integration",
    label: "Graphics Integration",
    branch: "app/graphics-integration"
  },
  { id: "app", label: "APP", branch: "app/app" }
];

export default function Page() {
  const [activeNav, setActiveNav] = useState<ActiveNav>("overview");

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
              aria-current={activeNav === item.id ? "page" : undefined}
              className="shell-nav-item"
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              type="button"
            >
              <span>{item.label}</span>
              <small>{item.branch}</small>
            </button>
          ))}
        </nav>
      </aside>

      <section className="shell-workspace">
        {activeNav === "overview" ? (
          <ShellArticle
            eyebrow="Portfolio Shell"
            title="Overview"
            description="Shell은 각 앱을 하나의 navigation surface로 모으고, 앱 성격에 따라 inline page, Module Federation remote, iframe inject를 선택한다."
            branch="app/overview"
            blocks={[
              ["Composition", "Overview, Micro Frontend, APP은 Shell 안에서 markdown-like content와 markup 중심으로 작성한다."],
              ["Runtime apps", "AX는 Module Federation remote로 붙이고, Design System은 Storybook app을 iframe으로 주입한다."],
              ["Branch model", "각 navigation app은 독립 브랜치에서 실험하고, Shell nav는 공통 통합 브랜치에서 조율한다."]
            ]}
          />
        ) : activeNav === "micro-frontend" ? (
          <ShellArticle
            eyebrow="Architecture"
            title="Micro Frontend"
            description="Micro Frontend는 앱을 무조건 remote로 쪼개는 뜻이 아니라, 배포와 런타임 경계를 명확히 정하는 방식이다."
            branch="app/micro-frontend"
            blocks={[
              ["Module Federation", "AX처럼 Shell React tree 안에 들어와야 하는 앱은 remote component를 expose한다."],
              ["iframe", "Storybook처럼 자체 runtime과 routing을 가진 도구 앱은 iframe으로 격리해서 보여준다."],
              ["Shell-owned pages", "문서, 설명, markup 중심 화면은 별도 앱을 만들지 않고 Shell에서 관리한다."]
            ]}
          />
        ) : activeNav === "ax" ? (
          <AXApp />
        ) : activeNav === "performance-optimization" ? (
          <ShellArticle
            eyebrow="Runtime Quality"
            title="Performance Optimization"
            description="성능 최적화 작업은 별도 브랜치에서 측정, 병목 제거, bundle/runtime 개선을 단계적으로 진행한다."
            branch="app/performance-optimization"
            blocks={[
              ["Measure", "Shell, remote entry, iframe app의 load time과 interaction cost를 분리해서 본다."],
              ["Optimize", "route-level lazy loading, remote preloading, shared dependency 정리를 우선한다."],
              ["Verify", "build output, browser waterfall, Core Web Vitals를 함께 기록한다."]
            ]}
          />
        ) : activeNav === "design-system" ? (
          <iframe
            className="app-frame"
            src={designSystemUrl}
            title="Design System"
          />
        ) : activeNav === "graphics-integration" ? (
          <ShellArticle
            eyebrow="Visual Systems"
            title="Graphics Integration"
            description="그래픽 통합은 Shell에 직접 넣기보다 canvas, WebGL, asset pipeline 같은 렌더링 경계를 먼저 정의한다."
            branch="app/graphics-integration"
            blocks={[
              ["Canvas", "2D interaction이나 chart-like rendering은 canvas layer로 분리한다."],
              ["WebGL", "3D 장면이 필요하면 Three.js 기반 remote나 isolated page로 확장한다."],
              ["Assets", "이미지, 모델, texture는 앱별 ownership과 preload 전략을 정한다."]
            ]}
          />
        ) : (
          <ShellArticle
            eyebrow="Application"
            title="APP"
            description="APP 영역은 실제 서비스 화면으로 확장될 공간이다. 초기에는 Shell 내부 markup으로 설계하고, 기능 경계가 커지면 remote app으로 분리한다."
            branch="app/app"
            blocks={[
              ["Shell first", "초기 정보 구조와 화면 흐름은 Shell에서 빠르게 만든다."],
              ["Extract later", "상태, 라우팅, 배포 경계가 독립되면 별도 app branch에서 remote로 분리한다."],
              ["Contract", "분리 시점에는 props, event, shared package 의존성을 먼저 문서화한다."]
            ]}
          />
        )}
      </section>
    </main>
  );
}

function ShellArticle({
  blocks,
  branch,
  description,
  eyebrow,
  title
}: {
  blocks: Array<[string, string]>;
  branch: string;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <article className="shell-page">
      <header className="shell-page-header">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        <span>{branch}</span>
      </header>
      <p className="shell-page-description">{description}</p>
      <div className="markup-grid">
        {blocks.map(([heading, body]) => (
          <section className="markup-block" key={heading}>
            <h3>{heading}</h3>
            <p>{body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
