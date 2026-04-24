# 🧱 Portfolio Architecture — Builder Edition

## TurboRepo + Next.js + Module Federation + Vercel

---

# 0. 🎯 Goal

이 프로젝트의 목적:

- 단순 포트폴리오 ❌
- 👉 “Builder / Frontend Architect” 역량 증명

핵심 메시지:

> “독립 배포 가능한 Micro Frontend 구조를 실제로 구현했다”

---

# 1. 🏗️ Final Architecture

```
TurboRepo (Monorepo)
├── apps/
│   ├── shell         (Next.js - Host)
│   ├── remote-chart  (Remote App)
│   └── remote-ai     (Remote App)
│
├── packages/
│   ├── ui
│   └── config
```

---

# 2. 🧠 Key Concepts

## ✔️ Monorepo

- 코드 관리 단위
- 개발 효율 ↑
- dependency 관리 쉬움

## ✔️ Micro Frontend (Module Federation)

- 런타임에서 앱을 조립
- 독립 배포 가능

## ✔️ Independent Deployment

- 각 앱이 따로 배포됨
- shell은 platform 역할

---

# 3. ⚙️ Tech Stack

- Monorepo: Turborepo
- Package Manager: pnpm
- Framework: Next.js
- Micro Frontend: Module Federation
- Deploy: Vercel

---

# 4. 📦 Setup

## 4.1 Create Project

```
pnpm create turbo@latest
```

---

## 4.2 Workspace 설정

### pnpm-workspace.yaml

```
packages:
  - apps/*
  - packages/*
```

---

## 4.3 turbo.json

```
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false
    }
  }
}
```

---

# 5. 🧩 Shell App (Next.js Host)

## 5.1 생성

```
cd apps
pnpm create next-app shell
```

---

## 5.2 Module Federation Plugin 설치

```
pnpm add @module-federation/nextjs-mf
```

---

## 5.3 next.config.js

```
const { NextFederationPlugin } = require('@module-federation/nextjs-mf')

module.exports = {
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'shell',
        remotes: {
          chart: `chart@${process.env.REMOTE_CHART_URL}/_next/static/chunks/remoteEntry.js`,
          ai: `ai@${process.env.REMOTE_AI_URL}/_next/static/chunks/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
        },
      })
    )
    return config
  },
}
```

---

## 5.4 Remote Component 사용

```
import dynamic from 'next/dynamic'

const ChartApp = dynamic(() => import('chart/App'), {
  ssr: false,
})

export default function Page() {
  return <ChartApp />
}
```

---

# 6. 🧩 Remote App 설정 (예: chart)

## 6.1 생성

```
cd apps
pnpm create next-app remote-chart
```

---

## 6.2 next.config.js

```
const { NextFederationPlugin } = require('@module-federation/nextjs-mf')

module.exports = {
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'chart',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './App': './components/App',
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
        },
      })
    )
    return config
  },
}
```

---

## 6.3 Remote Component

```
const App = () => {
  return <div>Chart Remote App</div>
}

export default App
```

---

# 7. 🚀 Vercel Deployment

## 7.1 프로젝트 분리

Vercel에서 각각 생성:

- shell → root: apps/shell
- remote-chart → root: apps/remote-chart
- remote-ai → root: apps/remote-ai

---

## 7.2 환경 변수 (shell)

```
REMOTE_CHART_URL=https://remote-chart.vercel.app
REMOTE_AI_URL=https://remote-ai.vercel.app
```

---

## 7.3 결과

- chart repo 수정 → chart만 deploy
- shell 수정 없음
- 👉 runtime에서 자동 반영

---

# 8. 🔥 Demo Scenario (포트폴리오 핵심)

👉 반드시 보여줄 것

1. chart 코드 수정
2. chart만 deploy
3. shell 재배포 없음
4. 실제 사이트 반영

---

# 9. ⚠️ Known Trade-offs

## ❌ SSR 불가능

- remote는 client-side only

## ❌ runtime dependency 문제

- version mismatch 가능

## ❌ 성능 오버헤드

- remoteEntry fetch 필요

---

# 10. ✅ Why This Architecture

- 독립 배포 가능
- Micro Frontend 구조 실증
- 플랫폼 설계 능력 증명

---

# 11. 🔜 Future (Step 2)

향후 확장:

- CDN (Cloudflare)
- remote versioning
- canary release
- runtime fallback

---

# ✅ Final Summary

👉 이 프로젝트는 단순 웹사이트가 아니라:

> “Micro Frontend 기반의 Runtime Composition Platform”

---
