# assesmentTemp frontend

Minimal Vite + TypeScript console for testing the teacher session booking API.

## Features

- Covers all six required assignment APIs.
- Labels both MongoDB aggregation endpoints.
- Shows the AVAILABLE → BOOKED → COMPLETED lifecycle.
- Displays request and response JSON in a live inspector.
- Automatically carries created IDs into later workflow steps.
- Includes the Postman collection as a download.

## Local setup

Requires Node.js 22 or newer.

```bash
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend URL. The default is:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Open <http://localhost:5173>.

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Import this repository into Vercel.
2. Add `VITE_API_BASE_URL=https://your-backend.onrender.com`.
3. Deploy. The included `vercel.json` configures the Vite build.
4. Add the final Vercel origin to the backend's `CORS_ORIGINS` variable.

The API URL is embedded during the Vercel build, so redeploy after changing it.
