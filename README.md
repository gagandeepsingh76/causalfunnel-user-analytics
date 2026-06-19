# TrackFlow AI

TrackFlow AI is a mini Mixpanel/Hotjar-style analytics platform with a standalone event tracker, a realtime Express API, MongoDB Atlas storage, and a premium dark SaaS dashboard built with Next.js 15.

## Features

- Standalone `tracker.js` script for automatic `page_view` and `click` tracking.
- Session storage with `session_id`, page URL, timestamp, click coordinates, user agent, device, browser, and country hints.
- Express + TypeScript API with Zod validation, centralized error handling, MongoDB aggregations, Socket.io realtime updates, CSV export, search, filters, and pagination.
- Next.js 15 App Router dashboard with Zustand state, Axios data layer, Recharts analytics, Framer Motion transitions, shadcn-style UI components, skeleton loaders, empty states, responsive layouts, and realtime activity.
- Heatmap page with URL selector, click intensity overlay, and hover analytics.
- Session journey page with ordered event timeline and CSV export.

## Folder Structure

```txt
trackflow-ai/
  apps/
    api/
      public/tracker.js
      src/
        config/
        controllers/
        middleware/
        models/
        routes/
        schemas/
        services/
        utils/
        app.ts
        index.ts
        socket.ts
    web/
      app/
        dashboard/
          heatmap/
          session/[id]/
        globals.css
        layout.tsx
        page.tsx
      components/
        charts/
        dashboard/
        layout/
        providers/
        ui/
      hooks/
      lib/
      store/
  package.json
  tsconfig.base.json
```

## Environment

Create environment files from the examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Update `MONGODB_URI` with your MongoDB Atlas connection string and set the web/API URLs for the environment you are running.

## Install

```bash
npm install
```

## Development

Run API and dashboard together:

```bash
npm run dev
```

Or run each app separately:

```bash
npm run dev -w apps/api
npm run dev -w apps/web
```

Default ports:

- API: `4000`
- Dashboard: `3000`
- Tracker script: served from the API origin configured in `NEXT_PUBLIC_API_URL`

## Tracking Script

Add this to any website you want to track:

```html
<script src="https://<your-render-service>.onrender.com/tracker.js"></script>
```

If you host the tracker separately, configure the endpoint before loading it:

```html
<script>
  window.TRACKFLOW_ENDPOINT = "https://<your-render-service>.onrender.com/api/events";
</script>
<script src="/tracker.js"></script>
```

When the tracker is loaded from the API service, it automatically derives the event endpoint from the script URL.

## API

- `POST /api/events` stores an event.
- `GET /api/sessions` returns paginated sessions with event counts and visit dates.
- `GET /api/sessions/:id` returns an ordered session journey.
- `GET /api/sessions/:id/export` exports one session as CSV.
- `GET /api/sessions/export` exports filtered session events as CSV.
- `GET /api/heatmap?page=...` returns click coordinate intensity data.
- `GET /api/heatmap/pages` returns tracked page URLs.
- `GET /api/analytics/overview` returns dashboard metrics, charts, feed, and live visitor count.

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for exact Render, Vercel, and MongoDB Atlas settings.

### MongoDB Atlas

Use a production cluster, restrict network access to your API host, and create a database user with scoped read/write permissions for the TrackFlow database.
