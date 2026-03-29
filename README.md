# FreeFindr

> Find free stuff near you. Fast.

A Houston-first free stuff alerts marketplace MVP. Shows free listings from Craigslist, Facebook Marketplace, Nextdoor, OfferUp, and TrashNothing — with keyword alerts and a strong lead-capture CTA for pickup/delivery help.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server (runs in mock mode without .env.local)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on `/feed` with mock data.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET=change-me
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these from your Supabase project at **Settings → API**.

---

## Setting Up the Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Open the SQL editor
3. Run the full migration: `supabase/migrations/001_initial.sql`
4. Seed with Houston listings:

```bash
npm run seed
```

---

## Mock Mode

**The app runs fully without Supabase configured.** If `NEXT_PUBLIC_SUPABASE_URL` is missing or set to the placeholder value, all data reads/writes use in-memory mock data from `lib/mock/data.ts`.

- 12 realistic Houston-area free listings
- 3 sample leads
- 5 sample keywords
- A mock mode banner appears in the feed header

To disable mock mode: add valid Supabase env vars.

---

## App Structure

```
app/
  feed/           — scrollable listing feed with filters
  listing/[id]/   — listing detail + lead capture form
  alerts/         — keyword alerts management
  settings/       — user preferences (saved to localStorage)
  onboarding/     — first-run setup flow
  admin/          — admin dashboard, leads, listings
  api/
    listings/     — GET listings with filter params
    leads/        — POST new lead submission
    keywords/     — GET/POST/DELETE user keywords

components/
  feed/           — ListingCard, FeedClient (search + filter)
  listing/        — ListingGallery, LeadForm (main CTA)
  settings/       — KeywordList, RadiusSelector, SourceToggleList
  shared/         — Button, Input, EmptyState, BottomNav

lib/
  supabase/       — browser + server Supabase clients
  db/             — queries.ts (reads), mutations.ts (writes)
  mock/           — seed data for mock mode
  types/          — Listing, Lead, UserSettings types
  utils/          — category detection, date formatting, keyword match
```

---

## Revenue Model

Every listing detail page shows the primary CTA:

> **"Need help picking this up?"**

Lead form captures name + phone + optional message. Leads are saved to Supabase and viewable in `/admin/leads`.

**Lead routing plan (coming next):**
- Twilio SMS to internal team on new lead
- Route to local movers, junk haulers, pallet buyers, resellers
- Tiered: free pickup help → paid delivery service

---

## Next Features to Build

| Priority | Feature |
|----------|---------|
| 🔴 High | Craigslist + Facebook scraper (use Playwright or RSS) |
| 🔴 High | Twilio lead routing (SMS on new lead) |
| 🟠 Med  | Push notifications for keyword matches |
| 🟠 Med  | Real user auth (Supabase magic link or phone OTP) |
| 🟠 Med  | Map view for listings |
| 🟡 Low  | Stripe subscription for resellers / businesses |
| 🟡 Low  | Business dashboard (view assigned leads) |
| 🟡 Low  | Paid delivery job marketplace |

---

## Key Design Decisions

- **Mock mode first** — zero setup to preview locally
- **Single-user dev mode** — `DEV_USER_ID` in `lib/types/user.ts` until auth is added
- **Server components by default** — pages fetch data server-side; only interactive parts are client
- **localStorage settings** — no auth needed for settings/prefs in MVP; structure is ready to sync to Supabase
- **Lead capture > everything** — every listing detail page drives toward the pickup CTA
