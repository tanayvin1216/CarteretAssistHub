<div align="center">


<img width="150" height="150" alt="assist-hub-logo" src="https://github.com/user-attachments/assets/24890cda-ae7c-4053-a68e-42a1195b90a9" />

# Carteret Assist Hub
### One directory for every kind of help in Carteret County

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

### Built for Carteret County, North Carolina

### **[View Live Demo →](https://carteret-assist-hub.vercel.app)**

<br/>

![GitHub stars](https://img.shields.io/github/stars/tanayvin1216/CarteretAssistHub?style=social)
![GitHub forks](https://img.shields.io/github/forks/tanayvin1216/CarteretAssistHub?style=social)

</div>

---

## The Story

I chair the Community Service Committee for the county Democratic Party and help run the local non-profit network. What I kept hearing — from pantries, shelters, foster-care advocates, tutors, coastal cleanup crews — was the same thing: *"nobody knows we exist."* The help is out there. Finding it is the hard part. Volunteering at the right place is even harder.

Assist Hub is the fix. Thirteen sectors of community need — from **food insecurity** and **housing** to **veterans**, **the arts**, and **the coast itself** — brought under one roof. An organization enters its information once. Residents search one directory. Volunteers see every open role in the county on a single page.

It's a sister site to [Food Assist](https://www.carteretfoodandhealthcouncil.org/). Both share the same Supabase database — when a food pantry updates its hours on Food Assist, the change shows up here instantly. No syncing, no duplicate work.

---

## What It Does

- 🗂️ **Browse by sector** — 13 curated areas: food, housing, foster care, youth & education, senior care, animals, environment, domestic & sexual violence, health care, veterans, recovery, civic engagement, arts & culture
- 🔍 **"I need help"** intent flow — pick a category, see every Carteret County non-profit that can help, filter by town or Spanish-language availability
- 🤝 **Cross-sector volunteer board** — apply to a specific role or send a general application, we match you to an organization
- 👥 **Subcommittee leadership** published per sector — every sector has named leads with contact info, so local journalists, funders, and partners know who to reach
- 📊 **Private admin dashboard** for the Community Service Committee — full CRUD on sectors, organizations, volunteer roles, applications, and leadership
- 🔗 **Shared backend with Food Assist** — one Supabase project, non-destructive schema overlay, so the 36 food pantries already in the Food Assist directory show up on day one
- 📱 **Mobile-first, accessible**, with a clean scroll-aware floating nav
- 🌐 **Bilingual English / Español** across every public-facing page

---

## The Thirteen Sectors

| # | Sector | # | Sector |
|---|---|---|---|
| 01 | Food Insecurity | 08 | Domestic & Sexual Violence |
| 02 | Housing & Homelessness | 09 | Health Care Access |
| 03 | Foster Care | 10 | Veterans |
| 04 | Youth & Education | 11 | Addiction & Recovery |
| 05 | Senior Care | 12 | Civic Engagement |
| 06 | Animals & Wildlife | 13 | Arts, History & Culture |
| 07 | Environment | | |

Each sector is run by a volunteer subcommittee of the Carteret County Community Service Committee.

---

## How It's Built

- **Next.js 16** (App Router, React Server Components, Turbopack)
- **TypeScript** end-to-end, strict mode
- **Tailwind CSS v4** with a custom warm palette and component system built on Radix primitives
- **Supabase** — Postgres, Auth, Row-Level Security; shared with Food Assist (one project, two apps)
- **Zod + React Hook Form** for every form
- **Vercel** hosting, auto-deploying from the `v1` branch

### Architecture note
The Assist Hub schema is an **additive overlay** on the Food Assist database. It adds `sectors`, `subcommittee_leads`, `sector_activities`, and a `sector_slug` column on `organizations` — nothing is dropped or renamed. Food Assist keeps working unchanged. An organization that's already in Food Assist is automatically part of Assist Hub's "Food Insecurity" sector.

---

## Getting Started

```bash
git clone https://github.com/tanayvin1216/CarteretAssistHub.git
cd CarteretAssistHub
cp .env.example .env.local
# Fill in:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

See `SETUP.md` for the full end-to-end setup (Supabase migrations, admin user seeding, Vercel deploy on the `v1` branch).

---

## Contributing

Bug reports, feature suggestions, Spanish translations, and PRs are all welcome. If you run a Carteret County non-profit and want your organization listed, reach out to the Community Service Committee.

---

## Contact

- **Live Site:** [carteret-assist-hub.vercel.app](https://carteret-assist-hub.vercel.app)
- **Sister Site:** [Food Assist](https://www.carteretfoodandhealthcouncil.org/)
- **GitHub:** [@tanayvin1216](https://github.com/tanayvin1216)
- **Email:** [Vinaykya27T@ncssm.edu](mailto:Vinaykya27T@ncssm.edu)
- **Issues:** [Report a bug or request a feature](https://github.com/tanayvin1216/CarteretAssistHub/issues)

---

<div align="center">
  Built with ❤️ for Carteret County, North Carolina
</div>
