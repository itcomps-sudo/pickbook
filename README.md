# Pickbook

Weekly NFL and college football lines with movement since open, plus a place to log
picks from pro bettors and drop notes. It's a PWA, so it installs on Android like an app.

Same stack as itcomps.com: Next.js 14, Prisma + Neon Postgres, Tailwind, Vercel.

## One-time setup

1. **Odds key.** Sign up free at https://the-odds-api.com and copy your API key.
2. **Database.** In Neon, create a new database called `pickbook` (a new project or a
   second database in your existing one both work). Copy its connection string.
3. **GitHub.** Create a new repo (for example `itcomps-sudo/pickbook`), unzip this
   folder into it, then commit and push.
4. **Vercel.** Import the repo as a new project. Before deploying, add these
   environment variables (see `.env.example`):
   - `DATABASE_URL`: the Neon connection string
   - `ODDS_API_KEY`: from step 1
   - `APP_PASSCODE`: what you'll type to unlock the app
   - `AUTH_SECRET`: any long random string
   - `CRON_SECRET`: any long random string
   - Optional: `ODDS_BOOK` (default `draftkings`), `ODDS_REFRESH_MINUTES` (default `180`)
5. **Deploy.** The build runs `prisma db push`, which creates the tables automatically.
6. **Optional domain.** In Vercel, add `picks.itcomps.com`, then add the CNAME record
   Vercel shows you at your DNS host.

## Install on your Android phone

Open the site in Chrome, sign in with your passcode, then tap the three-dot menu and
choose **Add to Home screen** (or **Install app**).

## How line movement works

- A daily Vercel cron (9 AM Eastern, see `vercel.json`) pulls NFL and CFB lines.
- Opening the app also pulls fresh lines if the last pull is older than
  `ODDS_REFRESH_MINUTES`. The Refresh button forces a pull, but never more than once
  every 15 minutes.
- A new snapshot is saved only when a line actually changes. The first snapshot is
  shown as "Open," meaning the first line Pickbook saw. Because the cron runs daily,
  that's within about a day of when books post the line.
- Moves of 1+ point on a spread or 1.5+ on a total are highlighted.

## API credits

Each pull costs 2 credits per sport (spreads + totals). The free tier is 500 per month.
The daily cron uses about 120 a month, which leaves room for roughly 90 extra pulls. If
you want tighter tracking, raise the plan and lower `ODDS_REFRESH_MINUTES`.

## Local development

```
npm install
cp .env.example .env    # fill it in
npx prisma db push
npm run dev
```

## Adding golf later

`lib/sports.ts` is the single list of sports. Golf odds are outrights (a price per
player to win), not spreads, so it needs its own list view and a small table for
outright prices. The picks and notes tabs already work for any sport added there.
