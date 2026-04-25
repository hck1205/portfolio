# 03. Storybook 디자인 시스템 정리

## 목표

디자인 시스템은 실제 UI 컴포넌트 소스와 문서 앱을 분리해서 관리한다.

```txt
packages/ui
= 재사용 가능한 UI 컴포넌트 패키지

apps/remote-design-system
= packages/ui를 보여주는 Storybook 문서 앱
```

## UI 컴포넌트 위치

공유 UI 컴포넌트는 `packages/ui`에 둔다.

```txt
packages/ui/src/components/Button.tsx
packages/ui/src/components/SurfaceCard.tsx
packages/ui/src/styles.css
```

Storybook stories도 컴포넌트 옆에 둔다.

```txt
packages/ui/src/components/Button.stories.tsx
packages/ui/src/components/SurfaceCard.stories.tsx
```

## Storybook 앱 위치

Storybook 앱은 다음 위치에서 관리한다.

```txt
apps/remote-design-system
```

패키지명:

```txt
@portfolio/remote-design-system
```

실행:

```bash
corepack pnpm --filter @portfolio/remote-design-system dev
```

기본 주소:

```txt
http://localhost:6006
```

## Shell에서 보여주는 방식

Design System은 Shell 안에 React 컴포넌트로 직접 붙이지 않는다. Storybook은 자체 manager UI, preview iframe, addon runtime, 정적 asset을 가진 도구 앱이므로 iframe으로 보여주는 방식이 적합하다.

Shell은 다음 URL을 iframe `src`로 사용한다.

```env
NEXT_PUBLIC_DESIGN_SYSTEM_URL=http://localhost:6006
```

기존 호환을 위해 다음 값도 fallback으로 지원한다.

```env
NEXT_PUBLIC_STORYBOOK_URL=http://localhost:6006
```

## 실행 명령

전체 개발 환경:

```bash
npm run dev:all
```

Design System만 실행:

```bash
npm run dev:remote-design-system
```

Storybook alias:

```bash
npm run dev:storybook
```

## 검증

타입체크:

```bash
corepack pnpm --filter @portfolio/remote-design-system typecheck
```

Storybook 빌드:

```bash
corepack pnpm --filter @portfolio/remote-design-system build
```

## 관리 원칙

- 디자인 시스템 문서 앱은 reusable component source를 소유하지 않는다.
- reusable component source는 `packages/ui`가 소유한다.
- Storybook은 `@portfolio/ui`를 import해서 문서화하고 검증한다.
