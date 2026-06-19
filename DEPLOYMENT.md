# TrackFlow AI Deployment

## Production URLs

- Web: `https://<your-vercel-app>.vercel.app`
- API: `https://<your-render-service>.onrender.com`
- Tracker script: `https://<your-render-service>.onrender.com/tracker.js`
- Tracker event endpoint: derived automatically as `/api/events` on the API origin.

## Render API

- Service type: Web Service
- Runtime: Node
- Root Directory: `apps/api`
- Install Command: `npm install`
- Build Command: `npm run build`
- Start Command: `npm start`
- Health Check Path: `/health`

Environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
API_CORS_ORIGIN=https://<your-vercel-app>.vercel.app
```

Render provides `PORT` automatically. The API reads it from `process.env.PORT`.

## Vercel Web

- Framework Preset: Next.js
- Root Directory: `apps/web`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.next`

Environment variables:

```env
NEXT_PUBLIC_API_URL=https://<your-render-service>.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://<your-render-service>.onrender.com
```

## MongoDB Atlas

- Create a production cluster.
- Create a database user with read/write access to the TrackFlow database.
- Use the Atlas connection string as `MONGODB_URI` in Render.
- Allow network access from Render. If static outbound IPs are not configured, use Render's current networking guidance for Atlas allowlisting.

## Package Scripts

API (`apps/api/package.json`):

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/index.js"
}
```

Web (`apps/web/package.json`):

```json
{
  "dev": "next dev --port 3000",
  "build": "next build",
  "start": "next start --port 3000"
}
```
