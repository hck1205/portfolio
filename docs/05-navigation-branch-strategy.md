# 05. Navigation과 브랜치 전략

## Navigation 기준

Shell navigation은 앱의 상태를 함께 보여준다.

- `Overview`: Shell 내부 화면이므로 상태를 표시하지 않는다.
- `live`: 실제 앱이 주입된다.
- `not live`: 아직 실제 앱이 없고 workspace에 `not live`를 표시한다.

## 현재 navigation

| Navigation | 앱 id | 상태 | 구현 위치 | 렌더링 방식 |
| --- | --- | --- | --- | --- |
| Overview | `overview` | Shell 내부 | `apps/shell/components/Overview` | Shell component |
| Micro Frontend | `micro-frontend` | not live | 미정 | `not live` |
| AX (AI Transformation) | `ax` | live | `apps/remote-ax` | Module Federation |
| Performance Optimization | `performance-optimization` | not live | 미정 | `not live` |
| Design System | `design-system` | live | `apps/remote-design-system` | iframe |
| Graphics Integration | `graphics-integration` | not live | 미정 | `not live` |
| APP | `app` | not live | 미정 | `not live` |

## 앱 id 관리

앱 id는 문자열을 직접 흩뿌리지 않고 상수로 관리한다.

```txt
apps/shell/components/LiveApp/LiveApp.const.ts
```

예시:

```ts
APP_ID.OVERVIEW
APP_ID.AX
APP_ID.DESIGN_SYSTEM
```

## Shell 설정 위치

navigation과 URL 설정은 Shell 소유다.

```txt
apps/shell/lib/navigation.ts
apps/shell/lib/urls.ts
```

## 브랜치 전략

공통 Shell navigation, 앱 매핑, 패키지 경계 변경은 통합 브랜치에서 진행한다.

```txt
feature/shell-navigation-app-map
```

각 앱이 커지면 별도 브랜치에서 작업한다.

```txt
app/ax-transformation
app/remote-design-system
app/performance-optimization
app/graphics-integration
app/app
```

## 분리 기준

처음부터 모든 navigation 항목을 앱으로 분리하지 않는다.

별도 앱으로 분리할 신호:

- 독립 배포가 필요하다.
- 라우팅이나 상태가 Shell과 분리되어야 한다.
- bundle 크기나 runtime 특성이 Shell에 부담을 준다.
- 해당 영역만 담당하는 작업 흐름이 생긴다.

그 전까지는 Shell 내부 컴포넌트 또는 `not live` 상태로 관리한다.
