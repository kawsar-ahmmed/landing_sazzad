# শাড়িঘর

Bangladeshi local sari-business landing page built with Next.js and PostgreSQL.

## Run locally

1. Start PostgreSQL: `docker compose up -d`
2. Copy config: `cp .env.example .env.local`
3. Run the single web server: `npm run dev`
4. Visit `http://localhost:3000` — the API is `POST /api/inquiries` on the same port.

## Production

Run `npm run build && npm start`. Set `DATABASE_URL` in your deployment environment.
