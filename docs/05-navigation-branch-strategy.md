# 05. Navigation and Branch Strategy

이 문서는 Shell navigation을 기준으로 앱 작업을 브랜치별로 나누는 전략을 정리한다.

## Navigation

Shell의 좌측 navigation은 다음 순서를 기준으로 한다.

| Navigation | Branch | 구현 위치 | 렌더링 방식 |
| --- | --- | --- | --- |
| Overview | `app/overview` | `apps/shell` | Shell inline content |
| Micro Frontend | `app/micro-frontend` | `apps/shell` | Shell inline content |
| AX (AI Transformation) | `app/ax-transformation` | `apps/remote-ax` | Module Federation |
| Performance Optimization | `app/performance-optimization` | 추후 결정 | Shell inline content 또는 remote app |
| Design System | `app/remote-design-system` | `apps/remote-design-system` | iframe inject |
| Graphics Integration | `app/graphics-integration` | 추후 결정 | Shell inline content 또는 remote app |
| APP | `app/app` | `apps/shell` | Shell inline content |

## Branch 기준

각 navigation app은 독립 브랜치에서 작업한다. 공통 Shell navigation, layout, app registry 변경은 별도의 통합 브랜치에서 진행한다.

현재 생성한 app branch는 다음과 같다.

```text
app/overview
app/micro-frontend
app/ax-transformation
app/performance-optimization
app/remote-design-system
app/graphics-integration
app/app
```

공통 Shell navigation 변경은 다음 브랜치에서 진행한다.

```text
feature/shell-navigation-app-map
```

## 구현 원칙

모든 navigation 항목을 별도 app으로 만들 필요는 없다. 화면의 성격에 따라 구현 위치를 나눈다.

| 화면 성격 | 추천 구현 |
| --- | --- |
| 설명, 문서, markup 중심 화면 | Shell 내부 page/component |
| Shell 안에서 React component처럼 동작해야 하는 앱 | Module Federation remote |
| 독립 실행형 도구 앱 | iframe |
| 라우팅, 상태, 배포 경계가 커진 앱 | 별도 remote app |

## Shell inline content

`Overview`, `Micro Frontend`, `APP`은 현재 별도 app을 만들지 않는다. 이 세 영역은 text와 markup 중심이므로 Shell에서 직접 관리하는 편이 단순하다.

이 방식은 초기 정보 구조를 빠르게 바꿀 수 있고, 불필요한 remote app과 배포 단위를 만들지 않아도 된다는 장점이 있다. 나중에 화면 상태, API, 라우팅, 배포 ownership이 커지면 해당 branch에서 별도 app으로 분리한다.

## Module Federation

`AX (AI Transformation)`은 기존 `apps/remote-ax`를 사용한다.

`remote-ax`는 `./AXApp`을 expose하고, Shell은 `ax/AXApp`을 동적 import한다.

```text
apps/remote-ax
└─ exposes ./AXApp

apps/shell
└─ imports ax/AXApp
```

이 구조는 Shell의 우측 content 영역 안에 remote React component를 직접 렌더링해야 할 때 사용한다.

## iframe inject

`Design System`은 iframe으로만 app inject한다.

Design System의 실제 실행 대상은 Storybook이다. Storybook은 manager UI, preview iframe, addon runtime, 정적 asset, 자체 routing을 가진 독립 앱이므로 Shell의 React tree에 Module Federation component처럼 직접 붙이지 않는다.

Shell은 `NEXT_PUBLIC_DESIGN_SYSTEM_URL`을 iframe `src`로 사용한다.

```env
NEXT_PUBLIC_DESIGN_SYSTEM_URL=http://localhost:6006
```

기존 호환을 위해 `NEXT_PUBLIC_STORYBOOK_URL`도 fallback으로 유지한다.

## 앞으로의 분리 기준

`Performance Optimization`, `Graphics Integration`은 지금은 Shell inline content로 시작해도 된다. 다만 아래 조건이 생기면 별도 app branch에서 remote app으로 분리한다.

| 분리 신호 | 설명 |
| --- | --- |
| 독립 배포가 필요하다 | Shell 배포와 분리해서 릴리즈해야 한다. |
| 런타임 의존성이 무겁다 | graphics, profiling, worker, WebGL처럼 bundle 영향이 크다. |
| 라우팅이 커진다 | 내부 하위 화면이 많아진다. |
| ownership이 분리된다 | 해당 앱만 담당하는 작업 흐름이 생긴다. |

이 기준을 넘기 전에는 Shell 안에서 작게 시작하고, 기준을 넘긴 뒤 remote app으로 추출한다.
