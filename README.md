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
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

Update `MONGODB_URI` with your MongoDB Atlas connection string.

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

Default URLs:

- API: `http://localhost:4000`
- Dashboard: `http://localhost:3000/dashboard`
- Tracker script: `http://localhost:4000/tracker.js`

## Tracking Script

Add this to any website you want to track:

```html
<script src="http://localhost:4000/tracker.js"></script>
```

For production:

```html
<script src="https://your-api-domain.com/tracker.js"></script>
```

If you host the tracker separately, configure the endpoint before loading it:

```html
<script>
  window.TRACKFLOW_ENDPOINT = "https://your-api-domain.com/api/events";
</script>
<script src="/tracker.js"></script>
```

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

### API

1. Create a MongoDB Atlas database.
2. Deploy `apps/api` to Render, Railway, Fly.io, or a Node-compatible host.
3. Set:
   - `MONGODB_URI`
   - `PORT`
   - `API_CORS_ORIGIN=https://your-dashboard-domain.com`
4. Build with `npm run build -w apps/api`.
5. Start with `npm run start -w apps/api`.

### Web

1. Deploy `apps/web` to Vercel.
2. Set:
   - `NEXT_PUBLIC_API_URL=https://your-api-domain.com`
   - `NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com`
3. Build with `npm run build -w apps/web`.

### MongoDB Atlas

Use a production cluster, restrict network access to your API host, and create a database user with scoped read/write permissions for the TrackFlow database.
