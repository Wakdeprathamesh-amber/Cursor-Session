# Amberstudent Ecommerce Demo

Server-rendered ecommerce demo with separate admin and user authentication, product CRUD, cart, and orders powered by Supabase Postgres.

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file at the project root with:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SESSION_SECRET=your_session_secret
```

## Database Setup

1. Open your Supabase project SQL editor.
2. Run the schema in `db/schema.sql`.
3. Seed demo data:

```bash
npm run db:seed
```

Then start the app:

```bash
npm start
```

Open `http://localhost:3000`.

## Demo Credentials

- Admin: `admin@amberstudent.demo` / `admin123`
- User: `priya@amberstudent.demo` / `user123`
- User: `arjun@amberstudent.demo` / `user123`

## Notes

- `npm run db:init` prints the schema file path for Supabase setup.
- `npm run db:seed` truncates tables and inserts demo data.

## Deploy on Render

1. Push this repo to GitHub.
2. In Render, click **New +** → **Web Service** and pick your GitHub repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in Render:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SESSION_SECRET`
6. Deploy. Render will run on the assigned URL.

Optional: `render.yaml` is included if you want to use Blueprint deploys.
