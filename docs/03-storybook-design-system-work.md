# Storybook Design System 작업 정리

## 작업 브랜치

```txt
feature/add-design-system-storybook
```

## 작업 목표

Micro Frontend 구조 안에서 독립적으로 실행 가능한 디자인 시스템 앱을 추가했다.

이번 단계의 목표는 다음과 같다.

- `packages/ui`에 공통 UI 컴포넌트 추가
- `apps/remote-design-system`에 Storybook 앱 추가
- Shell 앱 좌측 navigation 추가
- Shell 앱에서 Design System remote를 Module Federation으로 로드
- 배포 환경에서는 `NEXT_PUBLIC_DESIGN_SYSTEM_URL`로 Storybook URL을 주입
- 배포 환경에서는 `NEXT_PUBLIC_DESIGN_SYSTEM_REMOTE_URL`로 remote URL을 주입

## 추가한 앱

새 앱을 추가했다.

```txt
apps/remote-design-system
```

이 앱은 Storybook을 실행하는 디자인 시스템 앱이다.

실행 명령:

```bash
npm run dev:design
```

직접 실행되는 내부 명령:

```bash
corepack pnpm --filter @portfolio/remote-design-system dev
```

기본 실행 주소:

```txt
http://localhost:6006
```

## 추가한 공통 UI 컴포넌트

`packages/ui`에 디자인 시스템 컴포넌트를 추가했다.

```txt
packages/ui/src/components/Button.tsx
packages/ui/src/components/SurfaceCard.tsx
packages/ui/src/styles.css
```

Storybook stories도 함께 추가했다.

```txt
packages/ui/src/components/Button.stories.tsx
packages/ui/src/components/SurfaceCard.stories.tsx
```

현재 Storybook에서 확인 가능한 항목:

- Design System/Button
- Design System/SurfaceCard

## Shell 앱 연결 방식

Shell 앱에 좌측 navigation을 추가했다.

현재 navigation 항목:

```txt
Overview
Design System
```

아직 연결하지 않은 `Chart Remote`, `AI Remote` 메뉴는 제거했다.

Shell 메인 영역에는 iframe이 아니라 Module Federation으로 가져온 remote component를 표시한다.

```tsx
const RemoteDesignSystemShowcase = dynamic(() => import("designSystem/DesignSystemShowcase"), {
  ssr: false
});
```

remote 앱은 다음 모듈을 expose한다.

```txt
designSystem/DesignSystemShowcase
```

Shell은 이 모듈을 브라우저 런타임에서 가져온다.

Storybook은 여전히 문서/검증 앱으로 유지한다. Shell의 `Open Storybook` 버튼은 Storybook URL을 새 탭으로 여는 용도다.

## 배포 환경 변수

`.env.example`을 추가했다.

```env
NEXT_PUBLIC_DESIGN_SYSTEM_URL=http://localhost:6006
NEXT_PUBLIC_DESIGN_SYSTEM_REMOTE_URL=http://localhost:3003
```

Vercel에서 Shell 앱을 배포할 때는 다음처럼 실제 Storybook URL과 remote 앱 URL을 넣으면 된다.

```env
NEXT_PUBLIC_DESIGN_SYSTEM_URL=https://your-design-system.vercel.app
NEXT_PUBLIC_DESIGN_SYSTEM_REMOTE_URL=https://your-remote-design-system.vercel.app
```

`NEXT_PUBLIC_DESIGN_SYSTEM_URL`은 `Open Storybook` 버튼에 사용된다.

`NEXT_PUBLIC_DESIGN_SYSTEM_REMOTE_URL`은 Module Federation remoteEntry 위치를 계산하는 데 사용된다.

## 로컬 실행

Shell과 Storybook을 함께 실행하려면 루트에서 다음 명령을 사용한다.

```bash
npm run dev
```

현재 `npm run dev`는 다음을 함께 실행한다.

```txt
@portfolio/shell
@portfolio/remote-design-system
```

확인 주소:

```txt
Shell     -> http://localhost:3000
Remote    -> http://localhost:3003
Storybook -> http://localhost:6006 (별도 실행 시)
```

## 검증한 내용

다음 검증을 수행했다.

```bash
npm run typecheck
```

결과:

```txt
통과
```

Storybook 정적 빌드도 확인했다.

```bash
corepack pnpm --filter @portfolio/remote-design-system build
```

결과:

```txt
Storybook build completed successfully
```

Shell production build도 확인했다.

```bash
corepack pnpm --filter @portfolio/shell build
```

결과:

```txt
Compiled successfully
```

remote-design-system production build도 확인했다.

```bash
corepack pnpm --filter @portfolio/remote-design-system build
```

결과:

```txt
Compiled successfully
```

## Git 관리 상태

이 문서는 로컬 참고용이다.

현재 `.gitignore`에 `docs/`가 포함되어 있으므로 이 파일은 커밋과 PR에 포함되지 않는다.
