# 로컬 실행 가이드

## 현재 실행 방식 요약

현재 이 저장소는 pnpm workspace 기반의 Turborepo 형태로 구성되어 있다.

```txt
apps/
  shell         # 기본으로 실행되는 Next.js Host 앱
  remote-chart # 차트 Remote 앱
  remote-ai    # AI Remote 앱
packages/
  ui
  config
```

루트에서 가장 기본으로 사용하는 명령은 다음이다.

```bash
npm run dev
```

이 명령은 전체 앱을 모두 실행하지 않고, 기본 진입점인 `apps/shell`만 실행한다.

## npm run dev가 하는 일

루트 `package.json`의 `dev` 스크립트는 다음과 같다.

```bash
powershell -NoProfile -Command "Start-Process 'http://localhost:3000'; corepack pnpm --filter @portfolio/shell dev"
```

실행 순서는 다음과 같다.

1. Windows 기본 브라우저로 `http://localhost:3000`을 연다.
2. `corepack pnpm`을 통해 pnpm을 실행한다.
3. pnpm workspace filter로 `@portfolio/shell` 패키지만 선택한다.
4. `apps/shell/package.json`의 `dev` 스크립트를 실행한다.
5. Shell 앱의 Next.js dev server가 `3000` 포트에서 실행된다.

즉 현재 기본 개발 흐름은 다음과 같다.

```txt
루트 npm run dev
-> 브라우저에서 localhost:3000 열기
-> @portfolio/shell 선택
-> apps/shell 실행
-> Shell 앱 확인
```

## 처음 실행할 때

의존성이 없는 상태라면 먼저 setup을 실행한다.

```bash
npm run setup
```

이 명령은 내부적으로 다음을 실행한다.

```bash
corepack pnpm install
```

이후 개발 서버를 실행한다.

```bash
npm run dev
```

브라우저에서 열리는 주소는 다음이다.

```txt
http://localhost:3000
```

## 왜 npm 명령을 쓰는가

프로젝트의 실제 패키지 매니저는 pnpm이다.

```json
{
  "packageManager": "pnpm@10.9.0"
}
```

다만 로컬 PC에서 `pnpm` 명령이 PATH에 없을 수 있기 때문에, 루트 스크립트에서는 `corepack pnpm` 형태로 실행한다.

그래서 사용자는 다음처럼 npm 명령으로 시작할 수 있다.

```bash
npm run setup
npm run dev
```

실제 의존성 설치와 workspace 실행은 Corepack이 pnpm을 호출해서 처리한다.

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

현재 포트는 다음과 같다.

```txt
shell        -> http://localhost:3000
remote-chart -> http://localhost:3001
remote-ai    -> http://localhost:3002
```

## 전체 앱 실행

세 앱을 한 번에 실행하려면 다음 명령을 사용한다.

```bash
npm run dev:all
```

이 명령은 내부적으로 세 앱의 dev script를 병렬로 실행한다.

```bash
corepack pnpm --parallel --filter @portfolio/shell --filter @portfolio/remote-chart --filter @portfolio/remote-ai dev
```

현재는 Module Federation 연결 전이므로, 세 앱이 각각 독립적인 Next.js 앱으로 실행된다.

## 브라우저와 Cursor 터미널의 역할

`npm run dev`를 실행하면 브라우저가 자동으로 열리지만, Cursor 터미널에도 로그가 계속 표시된다.

이것은 정상이다.

- 브라우저: 실제 화면 확인
- Cursor 터미널: Next.js dev server 실행 로그 확인

터미널 프로세스를 종료하면 dev server도 종료된다.

## 3000 포트 충돌 해결

이미 Shell 앱이 실행 중인데 다시 `npm run dev`를 실행하면 다음 에러가 날 수 있다.

```txt
EADDRINUSE: address already in use :::3000
```

이 의미는 `3000` 포트를 이미 다른 프로세스가 사용 중이라는 뜻이다.

포트를 점유한 프로세스는 다음 명령으로 확인한다.

```powershell
netstat -ano | Select-String ":3000"
```

출력의 마지막 숫자가 PID다.

예를 들어 PID가 `215612`라면 다음 명령으로 종료한다.

```powershell
Stop-Process -Id 215612 -Force
```

그 뒤 다시 실행한다.

```bash
npm run dev
```

## 현재 하지 않은 것

현재 상태는 로컬 실행을 편하게 만든 단계다.

아직 다음 작업은 하지 않았다.

- Module Federation 연결
- Shell에서 Remote 앱 로드
- Vercel 배포 설정
- Branch preview 배포 설정
- 포트 충돌 자동 회피

## Git 관리 상태

이 문서는 로컬 참고용이다.

현재 `.gitignore`에 `docs/`가 추가되어 있으므로, 이 파일은 Git에 올라가지 않는다.

```txt
docs/
```

따라서 이 문서를 수정해도 PR 변경 사항에는 포함되지 않는다.
