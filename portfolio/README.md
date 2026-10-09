# Folio — Portfolio & Website Booking

Next.js 14 (App Router) + Tailwind + Postgres (Neon). Tables are created automatically on first request.

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo.
3. In the project → **Storage** → **Create Database** → choose **Neon (Postgres)** and connect it. This adds `DATABASE_URL`.
4. In **Settings → Environment Variables** add:
   - `AUTH_SECRET` — a long random string (`openssl rand -base64 32`)
   - `ADMIN_EMAIL` — the email that becomes the administrator
5. Deploy. Register an account using `ADMIN_EMAIL` → you land in the admin area.

## Local development
```
cp .env.example .env.local   # fill in values
npm install
npm run dev
```

## Features
User: register/login, dashboard, personal info, skills CRUD, book a website, my bookings (with status + admin notes).
Admin: dashboard with status counts, all bookings (filter by status), manage status
(Pending, In Review, Approved, In Progress, Completed, Rejected) + notes, view/edit any user's info and role.
