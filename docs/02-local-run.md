# 02. 로컬 실행 가이드

## 사전 준비

Node.js와 npm이 설치되어 있어야 한다. pnpm은 Corepack을 통해 실행한다.

의존성 설치:

```bash
npm run setup
```

내부적으로는 다음 명령이 실행된다.

```bash
corepack pnpm install
```

## 전체 개발 환경 실행

```bash
npm run dev:all
```

실행 대상:

```txt
@portfolio/ui
@portfolio/shell
@portfolio/remote-design-system
@portfolio/remote-ax
```

## 기본 개발 실행

```bash
npm run dev
```

이 명령은 Chrome에서 `http://localhost:3000`을 열고, Shell과 주요 remote 앱을 함께 실행한다.

## 개별 실행 명령

Shell:

```bash
npm run dev:shell
```

Design System:

```bash
npm run dev:remote-design-system
```

기존 alias:

```bash
npm run dev:storybook
```

AX remote:

```bash
npm run dev:ax
```

## 기본 포트

```txt
Shell                -> http://localhost:3000
Remote Design System -> http://localhost:6006
Remote AX            -> http://localhost:3004
```

## 환경 변수

Shell은 remote 앱 주소를 환경 변수로 받을 수 있다.

```env
NEXT_PUBLIC_DESIGN_SYSTEM_URL=http://localhost:6006
NEXT_PUBLIC_STORYBOOK_URL=http://localhost:6006
NEXT_PUBLIC_AX_REMOTE_URL=http://localhost:3004
```

`NEXT_PUBLIC_DESIGN_SYSTEM_URL`이 우선이고, 없으면 `NEXT_PUBLIC_STORYBOOK_URL`을 fallback으로 사용한다.

## 포트 충돌 해결

3000 포트가 이미 사용 중이면 다음 명령으로 프로세스를 확인한다.

```powershell
netstat -ano | Select-String ":3000"
```

마지막 숫자가 PID다. 예를 들어 PID가 `215612`라면 다음처럼 종료한다.

```powershell
Stop-Process -Id 215612 -Force
```

그 다음 다시 실행한다.

```bash
npm run dev
```

## 검증 명령

타입체크:

```bash
npm run typecheck
```

빌드:

```bash
npm run build
```

UI 패키지 빌드:

```bash
corepack pnpm --filter @portfolio/ui build
```
