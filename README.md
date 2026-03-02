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
