# 로컬 실행 가이드

## 현재 실행 방식 요약

현재 이 저장소는 Turborepo 형태의 pnpm 워크스페이스로 구성되어 있다.

```txt
apps/
  shell         # 기본으로 실행되는 Next.js Host 앱
  remote-chart # 차트 Remote 앱
  remote-ai    # AI Remote 앱
packages/
  ui
  config
```

루트에서 `npm run dev`를 실행하면 기본적으로 `apps/shell` 앱만 실행된다.

```bash
npm run dev
```

이 명령은 내부적으로 다음 일을 한다.

```bash
powershell -NoProfile -Command "Start-Process 'http://localhost:3000'; corepack pnpm --filter @portfolio/shell dev"
```

즉 순서는 다음과 같다.

1. Windows 기본 브라우저로 `http://localhost:3000`을 연다.
2. Corepack을 통해 pnpm을 실행한다.
3. pnpm workspace filter로 `@portfolio/shell` 패키지만 선택한다.
4. `apps/shell/package.json`의 `dev` 스크립트를 실행한다.
5. Shell 앱의 Next.js dev server가 `3000` 포트에서 실행된다.

## 왜 npm으로 실행하는가

이 프로젝트의 실제 패키지 매니저는 pnpm이다.

```json
{
  "packageManager": "pnpm@10.9.0"
}
```

다만 로컬 PC에서 `pnpm` 명령이 PATH에 없을 수 있기 때문에, 루트 스크립트에서는 `corepack pnpm` 형태로 실행한다.

그래서 사용자는 일단 익숙한 npm 명령으로 시작할 수 있다.

```bash
npm run setup
npm run dev
```

`npm run setup`은 다음 명령을 실행한다.

```bash
corepack pnpm install
```

이 명령은 `pnpm-lock.yaml`을 기준으로 의존성을 설치한다.

## 기본 실행 명령

처음 받은 뒤에는 다음 순서로 실행한다.

```bash
npm run setup
npm run dev
```

브라우저에서 열리는 주소는 다음과 같다.

```txt
http://localhost:3000
```

## 앱별 실행 명령

Shell 앱만 실행:

```bash
npm run dev:shell
```

Chart Remote 앱만 실행:

```bash
npm run dev:chart
```

AI Remote 앱만 실행:

```bash
npm run dev:ai
```

현재 포트는 각 앱의 `package.json`에 정의되어 있다.

```txt
shell        -> http://localhost:3000
remote-chart -> http://localhost:3001
remote-ai    -> http://localhost:3002
```

## 전체 앱 실행

세 앱을 한 번에 실행하려면 다음 명령을 사용할 수 있다.

```bash
npm run dev:all
```

이 명령은 pnpm filter를 사용해 세 앱의 dev script를 병렬로 실행한다.

```bash
corepack pnpm --parallel --filter @portfolio/shell --filter @portfolio/remote-chart --filter @portfolio/remote-ai dev
```

현재는 Module Federation 연결 전이므로, 세 앱이 각각 독립적인 Next.js 앱으로 실행된다.

## 현재 npm run dev가 여는 앱

`npm run dev`는 전체 앱을 실행하지 않는다.

현재 기본 개발 진입점은 Shell 앱이다.

```txt
루트 npm run dev
-> @portfolio/shell 선택
-> apps/shell 실행
-> localhost:3000 접속
```

이렇게 한 이유는 개발자가 가장 자주 확인할 화면이 Host 역할을 하는 Shell 앱이기 때문이다.

Remote 앱은 필요할 때 개별 실행하거나, 나중에 Module Federation 연결 작업을 진행할 때 `dev:all`로 함께 실행하면 된다.

## 브라우저가 자동으로 열리는 이유

기존에는 `npm run dev`를 실행하면 Cursor 터미널에 Next.js 로그만 표시되고, 브라우저는 직접 열어야 했다.

현재는 루트 `dev` 스크립트에 다음 명령이 포함되어 있다.

```bash
Start-Process 'http://localhost:3000'
```

이 명령은 Windows 기본 브라우저로 로컬 주소를 연다.

따라서 `npm run dev`를 실행하면 다음 두 가지가 함께 일어난다.

- 브라우저가 `http://localhost:3000`으로 열린다.
- Cursor 터미널에서는 Next.js dev server 로그가 계속 표시된다.

터미널 로그가 계속 남아 있는 것은 정상이다. 개발 서버가 실행 중이라는 뜻이다.

## 3000 포트 충돌 해결

이미 Shell 앱이 실행 중인 상태에서 `npm run dev`를 다시 실행하면 다음 에러가 날 수 있다.

```txt
EADDRINUSE: address already in use :::3000
```

이 의미는 `3000` 포트를 이미 다른 프로세스가 사용하고 있다는 뜻이다.

대부분의 경우 이전에 실행한 Next.js dev server가 아직 켜져 있는 상태다.

포트를 점유한 프로세스는 다음 명령으로 확인할 수 있다.

```powershell
netstat -ano | Select-String ":3000"
```

출력에서 마지막 숫자가 PID다.

예를 들어 PID가 `215612`라면 다음 명령으로 종료한다.

```powershell
Stop-Process -Id 215612 -Force
```

그 뒤 다시 실행한다.

```bash
npm run dev
```

## 현재 하지 않은 것

현재 로컬 실행 스크립트는 추가되었지만, 아직 다음 작업은 하지 않았다.

- Module Federation 연결
- Shell에서 Remote 앱 로드
- Vercel 배포 설정
- Branch preview 배포 설정
- 실제 포트 충돌 자동 회피

즉 현재 상태는 "Next.js 앱들을 로컬에서 쉽게 실행할 수 있게 만든 단계"다.

## 다음 개발 단계 후보

다음 작업은 별도 브랜치에서 진행하는 것이 좋다.

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feature/setup-module-federation
```

그 다음 Shell 앱이 `remote-chart`, `remote-ai`를 런타임에 불러오도록 Module Federation 설정을 추가하면 된다.
