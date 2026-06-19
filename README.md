# <h1 align="center">TrackFlow AI – Real-Time User Analytics Platform</h1>

<p align="center">
  A production-ready real-time user analytics platform that captures user sessions, page views, click events, device information, and visitor behavior using a lightweight tracking script, real-time dashboards, and scalable event processing.
</p>

<p align="center">
  <a href="https://causalfunnel-user-analytics-web.vercel.app/dashboard"><strong>Live Demo</strong></a>
  |
  <a href="https://causalfunnel-user-analytics.onrender.com"><strong>Backend API</strong></a>
  |
  <a href="https://causalfunnel-user-analytics.onrender.com/health"><strong>Health</strong></a>
  |
  <a href="https://github.com/gagandeepsingh76/causalfunnel-user-analytics"><strong>Repository</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
</p>

<p align="center">
  <img width="1344" height="614" alt="image" src="https://github.com/user-attachments/assets/9eb9ecec-af66-49f7-8e3d-ac3421eca843" />
</p>

---

# TrackFlow AI

TrackFlow AI is a full-stack real-time analytics platform designed to capture, process, and visualize user behavior across websites and applications.

The platform provides:

* Real-time session tracking
* Page view analytics
* Click event monitoring
* Device analytics
* Country tracking
* Session journey analysis
* Live dashboard updates
* CSV export functionality
* Lightweight tracking script integration

TrackFlow AI enables product teams, startups, and businesses to understand how users interact with their applications through a simple yet scalable analytics infrastructure.

---

# Live Demo

<p align="center">
  <a href="https://causalfunnel-user-analytics-web.vercel.app/dashboard">
    <strong>https://causalfunnel-user-analytics-web.vercel.app/dashboard</strong>
  </a>
</p>

---

# Backend API

<p align="center">
  <a href="https://causalfunnel-user-analytics.onrender.com">
    <strong>https://causalfunnel-user-analytics.onrender.com</strong>
  </a>
</p>

---

# Health Endpoint

<p align="center">
  <a href="https://causalfunnel-user-analytics.onrender.com/health">
    <strong>https://causalfunnel-user-analytics.onrender.com/health</strong>
  </a>
</p>

```bash
curl https://causalfunnel-user-analytics.onrender.com/health
```

---

# GitHub Repository

<p align="center">
  <a href="https://github.com/gagandeepsingh76/causalfunnel-user-analytics">
    <strong>https://github.com/gagandeepsingh76/causalfunnel-user-analytics</strong>
  </a>
</p>

---

# Product Screenshots

## Analytics Dashboard

<p align="center">
<img width="1344" height="614" alt="image" src="https://github.com/user-attachments/assets/18d655d6-8877-4622-acbd-1cf71e27318c" />
</p>

---

## Real-Time Session Monitoring

<p align="center">
<img width="1341" height="626" alt="image" src="https://github.com/user-attachments/assets/3a56089b-ee7e-4f97-8259-0d75cc249fcc" />
</p>

---

## Session Analytics

<p align="center">
 <img width="1344" height="634" alt="image" src="https://github.com/user-attachments/assets/f77dedab-0dfb-4023-b94a-ce3b55b8602a" />

</p>

---

## CSV Export

<p align="center">
 <img width="898" height="309" alt="image" src="https://github.com/user-attachments/assets/8b9f89f6-900a-4e39-b473-02749dbf0c8c" />

</p>

---

# Why TrackFlow AI?

Most analytics solutions are either:

* Expensive
* Difficult to integrate
* Over-engineered
* Privacy-invasive

TrackFlow AI provides a lightweight analytics system that can be embedded into any website using a single tracking script.

The platform focuses on:

* Fast integration
* Real-time visibility
* Session-based analytics
* Event-driven architecture
* Developer-friendly APIs

---

# Problem Statement

Modern websites require visibility into user behavior.

Organizations need answers to questions such as:

* Which pages are users visiting?
* How many sessions are active?
* What actions are users taking?
* Which devices are most commonly used?
* Which countries generate the most traffic?
* What is the user journey across pages?

TrackFlow AI solves these challenges through a lightweight tracking architecture and real-time analytics dashboard.

---

# System Architecture

```mermaid
flowchart TD

A[User Browser]

B[tracker.js]

C[Express API]

D[MongoDB Atlas]

E[Socket.IO]

F[Next.js Dashboard]

A --> B

B --> C

C --> D

C --> E

E --> F

D --> F
```

---

# Event Collection Flow

```mermaid
sequenceDiagram

participant User

participant Tracker

participant API

participant MongoDB

participant Dashboard

User->>Tracker: Page Visit

Tracker->>API: page_view

API->>MongoDB: Store Event

MongoDB-->>API: Saved

API->>Dashboard: WebSocket Update

Dashboard-->>User: Live Analytics

User->>Tracker: Click Event

Tracker->>API: click

API->>MongoDB: Store Event

API->>Dashboard: Real-time Update
```

---

# Key Features

* Real-Time Analytics Dashboard
* Session Tracking
* Page View Monitoring
* Click Event Tracking
* Device Analytics
* Country Analytics
* Session Journey Analysis
* CSV Export
* WebSocket Updates
* MongoDB Event Storage
* Tracker Script Integration
* Live Metrics Updates
* REST API Architecture
* Production Deployment Ready

---

# Technology Stack

| Layer            | Technology            |
| ---------------- | --------------------- |
| Frontend         | Next.js 15            |
| Language         | TypeScript            |
| Styling          | Tailwind CSS          |
| Backend          | Express.js            |
| Database         | MongoDB Atlas         |
| Realtime         | Socket.IO             |
| API              | REST                  |
| Hosting          | Vercel + Render       |
| Build Tool       | npm                   |
| Analytics Engine | Custom Event Pipeline |

---

# Project Structure

```text
causalfunnel-user-analytics/

├── apps/
│
├── api/
│   ├── src/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── tracker.js
│
├── web/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   └── lib/
│
├── README.md
│
└── DEPLOYMENT.md
```

---

# API Endpoints

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| GET    | /health        | Health Check          |
| GET    | /api/sessions  | Fetch Sessions        |
| GET    | /api/events    | Fetch Events          |
| POST   | /api/events    | Store Analytics Event |
| GET    | /tracker.js    | Tracking Script       |
| GET    | /api/analytics | Dashboard Analytics   |

---

# Environment Variables

## Backend

```env
PORT=10000

MONGODB_URI=your_mongodb_connection_string

API_CORS_ORIGIN=https://causalfunnel-user-analytics-web.vercel.app
```

## Frontend

```env
NEXT_PUBLIC_API_URL=https://causalfunnel-user-analytics.onrender.com

NEXT_PUBLIC_SOCKET_URL=https://causalfunnel-user-analytics.onrender.com
```

---

# Deployment Status

| Service        | Platform      | Status    |
| -------------- | ------------- | --------- |
| Frontend       | Vercel        | Live      |
| Backend        | Render        | Live      |
| Database       | MongoDB Atlas | Connected |
| WebSocket      | Socket.IO     | Active    |
| Event Tracking | Production    | Working   |

---

# Verification

Verified successfully:

* Dashboard loads correctly
* Events endpoint returns 201
* Session analytics working
* MongoDB connected
* WebSocket connected
* CSV export functional
* Tracker.js loaded globally
* Production deployment successful

---

# Author

**Gagandeep Singh**

GitHub: https://github.com/gagandeepsingh76

Project:
https://github.com/gagandeepsingh76/causalfunnel-user-analytics

---

# License

MIT License
