# 01. 초기 구성 정리

## 목적

이 문서는 포트폴리오 모노레포의 초기 구성과 현재 기준 구조를 정리한다. 저장소는 Turborepo, pnpm workspace, Next.js 앱, Module Federation remote, Storybook 기반 디자인 시스템으로 구성한다.

## 현재 디렉터리 구조

```txt
apps/
  shell/
  remote-ax/
  remote-design-system/
  remote-ai/
  remote-chart/
packages/
  ui/
docs/
```

## 역할

- `apps/shell`: 전체 화면과 좌측 navigation을 소유하는 host 앱
- `apps/remote-ax`: Shell에 Module Federation으로 주입되는 AX remote 앱
- `apps/remote-design-system`: Storybook 기반 디자인 시스템 문서 앱
- `apps/remote-ai`: 향후 AI remote 앱을 위한 공간
- `apps/remote-chart`: 향후 chart remote 앱을 위한 공간
- `packages/ui`: 여러 앱이 공유하는 UI 컴포넌트 패키지

## 제거한 구조

`packages/config`는 제거했다. navigation, URL 같은 설정은 실제로 Shell만 사용하므로 `apps/shell/lib` 아래에서 관리한다.

```txt
apps/shell/lib/navigation.ts
apps/shell/lib/urls.ts
```

## 기본 루트 파일

```txt
package.json
pnpm-workspace.yaml
turbo.json
tsconfig.base.json
.gitignore
```

## 패키지 관리

이 저장소는 pnpm workspace를 사용한다.

```json
{
  "packageManager": "pnpm@10.9.0"
}
```

로컬에서는 `pnpm` 명령이 PATH에 없을 수 있으므로 루트 스크립트는 `corepack pnpm` 형태를 사용한다.

## 개발 흐름

의존성 설치:

```bash
npm run setup
```

전체 개발 환경 실행:

```bash
npm run dev:all
```

Shell만 실행:

```bash
npm run dev:shell
```

전체 타입체크:

```bash
npm run typecheck
```

전체 빌드:

```bash
npm run build
```

## Git 기준

- `main`은 배포 가능한 상태를 유지한다.
- 기능 작업은 `feature/*` 브랜치에서 진행한다.
- 변경 사항은 PR을 통해 병합한다.
- 커밋 메시지는 `feat:`, `fix:`, `chore:`, `docs:` 같은 conventional commit 형식을 따른다.
