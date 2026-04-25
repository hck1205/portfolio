# 포트폴리오 초기화 정리

## 작업 맥락

- 작업일: 2026-04-24
- 저장소 브랜치: `main`
- 목표: `gitstrategy.md`와 `portfolio.md`를 기준으로 포트폴리오 앱 구조만 초기화

## 확인한 Git 전략

`gitstrategy.md`를 확인했고, 저장소 상태를 문서의 전략에 맞게 정리했다.

- `main`은 배포 가능한 상태를 유지하는 브랜치다.
- 작업은 `feature/*`, `fix/*`, `chore/*` 브랜치에서 진행한다.
- 변경 사항은 PR을 통해 머지하는 흐름을 기준으로 한다.
- 커밋 메시지는 `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...` 같은 컨벤션을 따른다.

로컬 브랜치 이름은 `master`에서 `main`으로 변경했다.

## 초기화한 앱 구조

프로젝트는 Turborepo 스타일의 모노레포 골격으로 초기화했다.

```txt
apps/
  shell/
  remote-chart/
  remote-ai/
packages/
  ui/
  config/
```

루트에는 다음 설정 파일을 추가했다.

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `tsconfig.base.json`
- `.gitignore`

각 앱에는 최소한의 Next.js App Router 구조를 추가했다.

- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `next-env.d.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`

## 의도적으로 하지 않은 작업

이번 작업은 초기화까지만 진행했다.

- 의존성은 설치하지 않았다.
- `pnpm-lock.yaml`은 생성하지 않았다.
- 개발 서버는 실행하지 않았다.
- 빌드와 타입 체크는 실행하지 않았다.
- Module Federation 연결은 아직 하지 않았다.
- 기능 구현은 추가하지 않았다.
- 커밋은 생성하지 않았다.

## 현재 참고 사항

- Node와 npm은 사용 가능하다.
- 현재 `pnpm`은 PATH에 잡혀 있지 않다.
- `corepack`은 사용 가능하므로 다음 단계에서 Corepack을 통해 pnpm을 활성화할 수 있다.

## CLI 작업 순서

이번 초기화 작업은 다음 순서로 진행했다.

### 1. 저장소 상태 확인

현재 폴더의 파일과 Git 상태를 먼저 확인했다.

```bash
Get-ChildItem -Force
rg --files -g "*.md"
git status --short --branch
```

확인 결과 루트에는 `gitstrategy.md`, `portfolio.md`가 있었고, 아직 커밋은 없는 상태였다.

### 2. 문서 내용 확인

Git 전략 문서와 포트폴리오 아키텍처 문서를 읽었다.

```bash
Get-Content -Raw gitstrategy.md
Get-Content -Raw portfolio.md
```

확인한 기준은 다음과 같다.

- Git 전략: `main` 중심, `feature/*` 브랜치 작업, PR 머지
- 앱 구조: Turborepo + Next.js + Module Federation + Vercel
- 패키지 매니저: pnpm
- 앱 구조: `apps/shell`, `apps/remote-chart`, `apps/remote-ai`
- 공유 패키지 구조: `packages/ui`

### 3. 로컬 개발 도구 확인

Node, pnpm, npm, 현재 브랜치를 확인했다.

```bash
node --version
pnpm --version
npm --version
git branch --show-current
```

확인 결과:

- Node: 사용 가능
- npm: 사용 가능
- pnpm: 현재 PATH에 없음
- 초기 브랜치: `master`

### 4. 초기 파일 생성

의존성 설치 없이 파일만 생성했다.

생성한 루트 파일:

```txt
package.json
pnpm-workspace.yaml
turbo.json
tsconfig.base.json
.gitignore
```

생성한 앱 구조:

```txt
apps/shell/
apps/remote-chart/
apps/remote-ai/
```

생성한 패키지 구조:

```txt
packages/ui/
```

각 앱에는 최소 Next.js App Router 구조만 추가했다.

```txt
package.json
next.config.mjs
tsconfig.json
next-env.d.ts
app/layout.tsx
app/page.tsx
app/globals.css
```

### 5. 브랜치 이름 변경

문서의 Git 전략에 맞춰 로컬 브랜치를 `master`에서 `main`으로 변경했다.

```bash
git branch -M main
```

처음에는 `.git/HEAD.lock` 권한 문제로 실패했기 때문에, 승인 후 다시 실행했다.

### 6. 생성 파일과 설정 검증

파일이 생성되었는지 확인하고, JSON 설정이 올바르게 읽히는지 확인했다.

```bash
Get-ChildItem -Recurse -File | Select-Object -ExpandProperty FullName
Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty name
Get-Content turbo.json | ConvertFrom-Json | Select-Object -ExpandProperty tasks
```

추가로 현재 Git 상태와 브랜치를 확인했다.

```bash
git status --short --branch
git branch --show-current
```

### 7. 사라진 원격 추적 정보 제거

브랜치 변경 후 `origin/master [gone]` 추적 정보가 남아 있어 제거했다.

```bash
git branch --unset-upstream
```

처음에는 `.git/config` 권한 문제로 실패했기 때문에, 승인 후 다시 실행했다.

### 8. 문서 폴더 생성 및 Git 제외

작업 기록을 남기기 위해 `doc/` 폴더와 `doc/init-summary.md`를 만들었다.

그리고 `doc/`는 Git에 포함하지 않도록 `.gitignore`에 추가했다.

```txt
doc/
```

마지막으로 ignored 상태를 확인했다.

```bash
git status --short --branch --ignored
```

확인 결과 `doc/`는 다음처럼 Git에서 제외된 상태였다.

```txt
!! doc/
```

## 다음 단계 제안

계속 진행할 때는 다음 순서로 진행하면 된다.

```bash
corepack enable
pnpm install
pnpm dev
```

의존성 설정 이후에는 다음과 같은 feature 브랜치에서 구현을 이어가는 것이 좋다.

```bash
git checkout -b feature/setup-module-federation
```
