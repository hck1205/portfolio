# 04. App Composition and Module Federation

이 문서는 현재 포트폴리오 앱 구조와 Shell에서 Storybook, AX remote를 보여주는 방식을 정리한다.

핵심 결론은 간단하다. Storybook은 독립 실행형 문서/도구 앱이므로 Shell에서는 iframe으로 보여주는 것이 맞고, AX처럼 우리가 만든 일반 React/Next 앱은 Module Federation remote로 렌더링할 수 있다.

## 현재 앱 구조

```text
portfolio
├─ apps
│  ├─ shell                # localhost:3000, 전체 화면과 좌측 nav를 가진 host 앱
│  ├─ remote-design-system # localhost:6006, @portfolio/remote-design-system 패키지
│  └─ remote-ax            # localhost:3004, AX Module Federation remote
├─ packages
│  ├─ ui                   # 여러 앱이 공유하는 UI 패키지
│  └─ config               # 공유 설정 패키지
├─ docs
│  ├─ 01-init-summary.md
│  ├─ 02-local-run.md
│  ├─ 03-storybook-design-system-work.md
│  └─ 04-app-composition-and-module-federation.md
└─ package.json
```

현재 Shell에서 실제로 사용하는 좌측 nav는 다음 두 개다.

| Nav | 렌더링 방식 | 대상 |
| --- | --- | --- |
| Storybook | iframe | `http://localhost:6006` |
| AX | Module Federation | `ax/AXApp` from `http://localhost:3004/_next/static/chunks/remoteEntry.js` |

## Shell의 역할

`apps/shell`은 host 앱이다. 브라우저에서 `http://localhost:3000`으로 접근하면 이 앱이 뜨고, 좌측 사이드 네비게이션과 우측 작업 영역을 가진다.

Storybook nav를 선택하면 Shell은 `NEXT_PUBLIC_STORYBOOK_URL`을 iframe `src`로 넣는다.

```tsx
<iframe
  className="storybook-frame"
  src={storybookUrl}
  title="Storybook"
/>
```

AX nav를 선택하면 Shell은 Module Federation으로 `ax/AXApp`을 동적 import해서 렌더링한다.

```tsx
const AXApp = dynamic(() => import("ax/AXApp"), {
  ssr: false,
  loading: () => <div className="remote-fallback">Loading AX remote...</div>
});
```

Shell의 remote 설정은 `apps/shell/next.config.mjs`에 있다.

```js
remotes: {
  ax: `ax@${axRemoteUrl}/_next/static/chunks/remoteEntry.js`
}
```

## Storybook은 왜 Module Federation이 맞지 않았나

Storybook은 하나의 React 컴포넌트라기보다 완성된 독립 실행형 도구 앱이다. 내부에는 manager UI, preview iframe, addon runtime, Storybook 전용 라우팅, 정적 asset 로딩, manager와 preview 사이의 통신 채널이 함께 묶여 있다.

Module Federation은 보통 remote 앱이 특정 컴포넌트나 모듈을 명시적으로 expose하고, host 앱이 그 모듈을 import해서 자기 React 트리 안에 붙이는 방식에 잘 맞는다. 예를 들면 `remote-ax`가 `./AXApp`을 expose하고 Shell이 `ax/AXApp`을 import하는 구조다.

반대로 Storybook 전체 UI를 Shell의 React 트리 안으로 직접 가져오면 다음 문제가 생긴다.

| 문제 | 설명 |
| --- | --- |
| 앱 형태가 다름 | Storybook은 `AXApp` 같은 단일 업무 컴포넌트가 아니라 완성된 manager 앱이다. |
| 내부 iframe 의존 | Storybook 자체가 preview 렌더링을 위해 iframe 구조를 사용한다. |
| 라우팅과 asset 경로 | Storybook manager의 URL, 정적 파일, addon asset 경로가 Storybook 서버 기준으로 동작한다. |
| 런타임 통신 | manager, preview, addon이 Storybook 런타임 채널로 통신한다. |
| 원본 UI 보존 | Shell에서 스타일을 덮거나 React 트리로 감싸면 Storybook 기본 UI가 깨질 수 있다. |

그래서 `http://localhost:6006`에서는 Storybook이 정상인데, Module Federation으로 Shell 안에 직접 붙이면 "Loading Storybook" 이후 실제 manager UI가 나오지 않는 상태가 발생했다. 이것은 Storybook 서버가 죽어서가 아니라, Storybook 전체 앱이 Federation remote 컴포넌트로 소비되기 좋은 형태가 아니기 때문이다.

## iframe이 맞는 경우

iframe은 외부 앱을 그대로 보존해서 보여줄 때 적합하다. 특히 아래 조건이면 iframe이 더 안전하다.

| 조건 | 예시 |
| --- | --- |
| 이미 완성된 독립 앱이다 | Storybook, Adminer, Swagger UI, Grafana 같은 도구 |
| 자체 라우팅과 asset 경로가 중요하다 | `/iframe.html`, `/index.json`, addon asset 등 |
| 내부 스타일을 Shell이 건드리면 안 된다 | Storybook 기본 manager UI |
| 앱 내부가 다시 iframe을 사용한다 | Storybook preview 영역 |
| host와 remote의 React 트리를 섞을 필요가 없다 | 문서/도구/모니터링 화면 |

이번 프로젝트의 Storybook은 "Shell 안에서 스타일링하지 않고 처음 나오는 format 그대로 보여주기"가 목표였으므로 iframe이 가장 맞는 선택이다.

## 다른 앱은 왜 Module Federation이 가능한가

우리가 직접 만드는 앱은 Shell에 붙일 컴포넌트 경계를 정할 수 있다. `remote-ax`는 이 방식으로 만들어진 예시다.

`apps/remote-ax/next.config.mjs`에서 AX 앱은 `./AXApp`을 expose한다.

```js
new NextFederationPlugin({
  name: "ax",
  filename: "static/chunks/remoteEntry.js",
  exposes: {
    "./AXApp": "./components/AXApp.tsx"
  }
});
```

Shell은 이 remote entry를 보고 `ax/AXApp`을 가져온다.

```js
ax: `ax@${axRemoteUrl}/_next/static/chunks/remoteEntry.js`
```

이 구조는 Storybook과 다르다. `AXApp`은 Shell의 우측 content 영역에 들어갈 목적으로 만든 일반 React 컴포넌트이며, 자체 manager UI나 addon runtime, preview iframe 같은 Storybook 전용 구조가 없다. 그래서 Module Federation으로 자연스럽게 붙일 수 있다.

## 선택 기준

앞으로 새 micro frontend를 만들 때는 아래 기준으로 고르면 된다.

| 만들려는 것 | 추천 방식 | 이유 |
| --- | --- | --- |
| Shell의 일부처럼 동작해야 하는 업무 화면 | Module Federation | host와 remote가 React 컴포넌트 경계를 공유할 수 있다. |
| 새 기능 앱, 대시보드, AX 화면 | Module Federation | remote가 `./SomeApp`을 expose하면 Shell nav에 붙이기 쉽다. |
| Storybook 같은 독립 도구 | iframe | 원래 앱의 라우팅, 스타일, 내부 iframe, asset 로딩을 보존한다. |
| 외부 SaaS나 별도 서버 앱 | iframe | Shell과 번들/runtime을 섞을 필요가 없다. |

정리하면 "Storybook만 특별히 안 된다"라기보다, "Storybook 전체 manager 앱을 Module Federation 컴포넌트처럼 직접 렌더링하는 방식이 맞지 않는다"가 더 정확하다. 우리가 만든 일반 remote 앱은 Module Federation으로 가능하다.

## 실행 명령과 포트

루트에서 전체 개발 환경을 실행한다.

```bash
npm run dev
```

이 명령은 Chrome으로 `http://localhost:3000`을 열고, Shell, Storybook, AX remote를 함께 실행한다.

| 앱 | 명령 | 포트 |
| --- | --- | --- |
| Shell | `corepack pnpm --filter @portfolio/shell dev` | `3000` |
| Storybook | `corepack pnpm --filter @portfolio/remote-design-system dev` | `6006` |
| AX remote | `corepack pnpm --filter @portfolio/remote-ax dev` | `3004` |

환경 변수 기본값은 `.env.example`에 있다.

```env
NEXT_PUBLIC_STORYBOOK_URL=http://localhost:6006
NEXT_PUBLIC_AX_REMOTE_URL=http://localhost:3004
```

## 현재 검증 상태

현재 구조에서 확인한 내용은 다음과 같다.

| 확인 항목 | 결과 |
| --- | --- |
| `http://localhost:6006` | Storybook 기본 UI 표시 |
| `http://localhost:3004` | `Hello AX` 표시 |
| `http://localhost:3004/_next/static/chunks/remoteEntry.js` | remote entry 응답 |
| `http://localhost:3000` | Shell 표시 |
| Shell Storybook nav | iframe으로 Storybook 표시 |
| Shell AX nav | Module Federation으로 AX remote 표시 |
| `npm run typecheck` | 통과 |
| `corepack pnpm --filter @portfolio/shell build` | 통과 |
| `corepack pnpm --filter @portfolio/remote-ax build` | 통과 |

