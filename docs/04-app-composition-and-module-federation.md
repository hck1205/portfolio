# 04. 앱 구성과 Module Federation

## 현재 구성

```txt
portfolio
├─ apps
│  ├─ shell
│  ├─ remote-ax
│  ├─ remote-design-system
│  ├─ remote-ai
│  └─ remote-chart
├─ packages
│  └─ ui
└─ docs
```

## Shell의 역할

`apps/shell`은 host 앱이다. 좌측 navigation과 오른쪽 workspace를 소유한다.

Shell은 navigation 항목을 다음 기준으로 렌더링한다.

- Shell 내부 화면: Shell 컴포넌트로 렌더링
- live 앱: 실제 remote 또는 iframe으로 주입
- 아직 live가 아닌 앱: `not live` 표시

## live 상태

`live`는 Shell이 실제 앱 화면을 주입할 수 있는지를 의미한다.

```txt
live: true  -> 실제 앱 주입
live: false -> not live 표시
```

`Overview`는 Shell 내부 화면이므로 live 상태를 표시하지 않는다.

## 현재 live 앱

| 앱 | 방식 | 대상 |
| --- | --- | --- |
| AX | Module Federation | `ax/AXApp` |
| Design System | iframe | `http://localhost:6006` |

## AX remote

`apps/remote-ax`는 Module Federation remote다.

remote는 다음 모듈을 expose한다.

```txt
./AXApp
```

Shell은 다음 이름으로 import한다.

```txt
ax/AXApp
```

Shell 설정:

```js
remotes: {
  ax: `ax@${axRemoteUrl}/_next/static/chunks/remoteEntry.js`
}
```

## Design System iframe

`apps/remote-design-system`은 Storybook 앱이다. Storybook은 독립적인 도구 앱이므로 Module Federation 컴포넌트처럼 Shell의 React tree에 직접 붙이지 않는다.

Shell은 iframe으로 보여준다.

```tsx
<iframe
  className="app-frame"
  src={designSystemUrl}
  title="Design System"
/>
```

## Shell 내부 컴포넌트

`Overview`는 별도 앱이 아니다. Shell 내부 컴포넌트로 관리한다.

```txt
apps/shell/components/Overview/
```

## 앱 주입 컴포넌트

live 앱 주입은 다음 컴포넌트에서 관리한다.

```txt
apps/shell/components/LiveApp/
```

`LiveApp.const.ts`는 앱 id 상수를 소유한다. `LiveApp.tsx`는 `switch` 문으로 앱 id에 맞는 주입 방식을 선택한다.

## 선택 기준

| 화면 성격 | 권장 방식 |
| --- | --- |
| Shell 소유의 기본 화면 | Shell component |
| Shell 안에 React 컴포넌트처럼 들어와야 하는 앱 | Module Federation |
| 자체 runtime과 routing이 중요한 도구 앱 | iframe |
| 배포 단위가 분리되어야 하는 기능 | 별도 remote app |
