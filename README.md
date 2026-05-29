# EW-TC Team ACTV - Final Ready App

A deployable internal campaign operations app combining the PDF-grounded campaign matrix with the richer workflow features from the Eyeworld workflow app.

## Included modules

- 4-digit PIN login for Hamdi, Hadeer, Bakr, and Asmaa
- Campaign Command Center using only the Marketing Status & Strategy Report matrix and active ads
- Creative Requests workflow: Pending, Returned, Approved, Published, Back for Update, Closed
- Manager approval and return comments
- Media buyer publish, back-for-update, and close actions
- Green Light indicator for approved/published work
- Brief Board with assignment, deadline, status pipeline, and Seen acknowledgment
- Creative file submission and approval/revision history
- Weekly Reception Report with automatic Real CPL and week delta
- Team Status Feed with yesterday/today/blockers
- Global Activity Log
- Supabase-ready database schema and storage plan
- Vercel-ready project configuration

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:4028.

## PIN demo users

- Hamdi: `1001`
- Hadeer: `2002`
- Bakr: `3003`
- Asmaa: `4004`

## Supabase setup

Create a free Supabase project, copy `.env.example` to `.env.local`, and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run `supabase/schema.sql` in the Supabase SQL editor and create a private storage bucket named `creative-submissions`.

## Deploy

Deploy this folder to Vercel. Add the Supabase environment variables in the Vercel project settings.
