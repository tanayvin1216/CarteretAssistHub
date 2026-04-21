# Carteret Assist Hub

A unified directory and volunteer coordination platform for the 13 non-profit sectors
of Carteret County, NC. Built alongside Food Assist — they share a single Supabase
backend, so an organization that lists itself once is visible everywhere it belongs.

## Sectors

Food Insecurity · Housing & Homelessness · Foster Care · Youth & Education · Senior
Care · Animals & Wildlife · Environment · Domestic & Sexual Violence · Health Care
Access · Veterans · Addiction & Recovery · Civic Engagement · Arts, History & Culture

## Stack

- Next.js 16 + React 19
- Tailwind CSS v4
- Supabase (Postgres + Auth + RLS) — same project as FoodAssist_V2
- TypeScript strict
- shadcn/ui primitives via Radix

## Getting started

```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

## Branch strategy

- `main` — local working branch
- `v1` — connected to Vercel production deploy
