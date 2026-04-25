# 06. Shell 앱과 UI 패키지 관리

## 목적

이 문서는 Shell, live app, 디자인 시스템 remote, 공유 UI 패키지를 어떻게 관리할지 정리한다.

## 앱 소유권

- `apps/shell`: navigation, Shell layout, Shell 내부 화면을 소유한다.
- `apps/remote-ax`: Module Federation으로 주입되는 live remote 앱이다.
- `apps/remote-design-system`: iframe으로 보여주는 Storybook/design-system 앱이다.
- `packages/ui`: 여러 앱이 재사용하는 UI 컴포넌트 패키지다.

`Overview`는 독립 앱이 아니다. Shell의 일부로 관리한다.

```txt
apps/shell/components/Overview/
```

## live 상태

navigation의 `live` 값은 Shell이 실제 앱 화면을 주입할 수 있는지를 나타낸다.

- `live: true`: Module Federation remote 또는 iframe으로 실제 앱을 보여준다.
- `live: false`: workspace에 `not live`를 표시한다.
- `Overview`: Shell 내부 화면이므로 nav에 live 상태를 표시하지 않는다.

## Shell 컴포넌트 패턴

Shell 내부 기능 컴포넌트는 다음 구조를 따른다.

```txt
ComponentName/
  ComponentName.tsx
  ComponentName.view.tsx
  ComponentName.styled.ts
  ComponentName.utils.ts
  ComponentName.types.ts
  index.ts
```

역할:

- `ComponentName.tsx`: 비즈니스 로직과 데이터 준비
- `ComponentName.view.tsx`: UI 렌더링
- `ComponentName.styled.ts`: className 상수
- `ComponentName.utils.ts`: 로컬 helper
- `ComponentName.types.ts`: 로컬 타입
- `index.ts`: public export만 담당

## live app 주입

live app 주입은 다음 위치에서 관리한다.

```txt
apps/shell/components/LiveApp/
```

`LiveApp.const.ts`는 앱 id 상수를 정의한다. `LiveApp.tsx`는 `switch` 문으로 앱 id에 맞는 렌더링 방식을 선택한다.

현재 주입 방식:

- `AX`: Module Federation remote
- `Design System`: iframe

## UI 패키지

`packages/ui`는 npm 패키지 경계다. reusable component source는 이 패키지가 소유한다.

빌드 산출물:

- ESM
- CJS
- 타입 선언
- CSS

소비 방식:

```ts
import { Button, SurfaceCard } from "@portfolio/ui";
import "@portfolio/ui/styles.css";
```

## 디자인 시스템 앱과 UI 패키지의 관계

`apps/remote-design-system`은 UI 컴포넌트 소스를 소유하지 않는다. 이 앱은 `@portfolio/ui`를 import해서 Storybook으로 보여주고 검증한다.

```txt
packages/ui
= 제품 코드

apps/remote-design-system
= 제품 문서와 검증 환경
```
