# 🧠 Git Strategy — Solo Builder (Production Ready)

---

# 0. 🎯 Goal

이 전략의 목적:

- 빠른 개발 속도
- 안정적인 배포
- 명확한 히스토리 관리
- 포트폴리오에서 “프로세스까지 잘하는 개발자”로 보이기

---

# 1. 🌳 Branch Strategy (최종)

```txt
main (production)
 ├── feature/*
 ├── fix/*
 └── chore/*
```

---

## 규칙

- `main` → 항상 배포 가능 상태 유지
- 모든 작업은 feature branch에서 진행
- merge = deploy

---

# 2. 🔁 Workflow

## 1) 작업 시작

```bash
git checkout main
git pull
git checkout -b feature/add-chart-remote
```

---

## 2) 개발 진행

작업 단위를 작게 유지 (1~2일 내 완료)

---

## 3) 커밋

```bash
git add .
git commit -m "feat: add chart remote federation"
```

---

## 4) 푸시

```bash
git push origin feature/add-chart-remote
```

---

## 5) PR 생성 (혼자라도 필수)

---

## 6) Merge → 자동 배포

👉 Vercel:

- feature branch → preview URL 생성
- main → production 배포

---

# 3. ✍️ Commit Convention

👉 반드시 구조화 (이게 수준 차이 만든다)

---

## 기본 포맷

```txt
type: short description
```

---

## 타입 정의

```txt
feat: 새로운 기능
fix: 버그 수정
refactor: 코드 구조 개선
chore: 설정 / 빌드 관련
docs: 문서
test: 테스트
perf: 성능 개선
```

---

## 예시

```txt
feat: add module federation setup
fix: resolve remoteEntry loading issue
refactor: extract shared ui components
chore: update turbo config
perf: optimize remote loading
```

---

# 4. 🧾 PR Template

👉 `.github/pull_request_template.md`

```md
# 📌 Summary

<!-- 무엇을 했는지 -->

- ***

# 🎯 Purpose

<!-- 왜 했는지 -->

- ***

# 🔥 Changes

<!-- 주요 변경 사항 -->

- ***

# ⚠️ Risk / Trade-off

<!-- 리스크 및 고려사항 -->

- ***

# 🧪 How to Test

<!-- 테스트 방법 -->

- ***

# 📷 Screenshot (optional)
```

---

# 5. 🔒 Branch Protection (추천)

GitHub 설정:

- main branch 보호
- 직접 push 금지
- PR 통해서만 merge

---

# 6. 🚀 Vercel Flow

| Branch     | 결과        |
| ---------- | ----------- |
| feature/\* | Preview URL |
| main       | Production  |

---

## 예시

```txt
feature/add-chart
→ https://feature-add-chart.vercel.app

main
→ https://portfolio.vercel.app
```

---

# 7. 📦 Multi-Repo 적용

각 repo 동일 전략 적용

```txt
portfolio-shell
portfolio-remote-chart
portfolio-remote-ai
```

👉 각 repo:

- 독립 PR
- 독립 deploy
- 독립 version

---

# 8. ⚠️ Anti-Patterns (절대 금지)

## ❌ Git Flow

```txt
develop
release
hotfix
```

👉 혼자에게 과도한 복잡도

---

## ❌ Long-lived branch

```txt
feature/big-refactor (2주 이상)
```

👉 충돌 + 리스크 증가

---

## ❌ Direct push to main

👉 rollback 불가능 + 히스토리 불명확

---

# 9. 🧠 Advanced (Builder 포인트)

## 9.1 Version Tagging

```bash
git tag chart-v1.0.0
git push origin chart-v1.0.0
```

👉 remote 버전 관리 가능

---

## 9.2 Release Note

```md
# v1.0.0

- chart remote initial release
- federation 연결 완료
```

---

## 9.3 작은 단위 Merge

👉 하루 1~3 merge 목표

---

# 10. ✅ Final Summary

👉 너의 최종 전략:

```txt
Trunk-Based Development
+ Feature Branch
+ PR 필수
+ Vercel Preview 활용
+ Commit Convention
```

---
