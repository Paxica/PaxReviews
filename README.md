# PaxReviews — Google Reviews Widget for Framer

A Next.js widget that fetches Google Reviews for a single business and renders them as a dark, horizontally-scrollable card row. Designed to be embedded in Framer via a single `<iframe>` URL.

---

## How it works

- Reviews are fetched **server-side** via the Google Places API — your API key is never exposed to the browser.
- Results are cached in-memory for **24 hours** to avoid unnecessary API calls.
- Only reviews with a rating ≥ `MIN_STAR_RATING` are shown (default: 4 stars).
- The widget background is transparent, so it inherits your Framer page background.

---

## 1. Get your Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or select an existing one).
3. Enable the **Places API** under *APIs & Services → Library*.
4. Go to *APIs & Services → Credentials*, click **Create Credentials → API Key**.
5. *(Recommended)* Restrict the key to the **Places API** only, and restrict it to your Vercel deployment domain under *Application restrictions → HTTP referrers*.
6. Copy the key — you'll need it in step 3.

---

## 2. Find your Place ID

1. Visit the [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder).
2. Search for your business by name.
3. Click on the result — the Place ID is shown in the info window (format: `ChIJ...`).
4. Copy it — you'll need it in step 3.

---

## 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GOOGLE_PLACES_API_KEY=AIza...your_key_here
GOOGLE_PLACE_ID=ChIJ...your_place_id_here
MIN_STAR_RATING=4          # optional, defaults to 4
```

> **Important:** Never commit `.env.local` to git. It's already listed in `.gitignore`.

---

## 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the widget with live reviews.

---

## 5. Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. When asked about environment variables, add:

| Variable | Value |
|---|---|
| `GOOGLE_PLACES_API_KEY` | your API key |
| `GOOGLE_PLACE_ID` | your Place ID |
| `MIN_STAR_RATING` | `4` (or your preferred minimum) |

### Option B — Vercel Dashboard (GitHub import)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In *Environment Variables*, add the three variables above.
4. Click **Deploy**.

After deployment, your widget URL will be something like:
```
https://your-project.vercel.app
```

---

## 6. Embed in Framer

1. Open your Framer project.
2. In the left panel, click **+** → **Embed**.
3. Paste your Vercel URL into the embed URL field:
   ```
   https://your-project.vercel.app
   ```
4. Resize the embed component to fit your layout (recommended height: 280–320 px; width: 100%).
5. Publish your Framer site.

> **Tip:** Set the embed to `scrolling: auto` so the horizontal card scroll works on touch devices.

---

## Caching & refresh

Reviews are cached in-memory for 24 hours. On Vercel, each serverless function instance has its own cache. A new deployment always clears the cache. If you need persistent cross-instance caching, replace the in-memory cache in `src/lib/reviews.ts` with [Vercel KV](https://vercel.com/docs/storage/vercel-kv) or Next.js [ISR revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating).

---

## Project structure

```
src/
  app/
    page.tsx              # Root route — renders the widget only
    layout.tsx            # Minimal layout, transparent background
    globals.css           # Tailwind + custom scrollbar
    api/reviews/route.ts  # Server-side API route (optional direct use)
  components/
    ReviewsWidget.tsx     # Server component — fetches & renders reviews
    ReviewCard.tsx        # Individual review card with expand/collapse
    StarRating.tsx        # SVG star rating display
    GoogleLogo.tsx        # Google branding (required by ToS)
  lib/
    reviews.ts            # Google Places API fetch + 24h in-memory cache
```

---

## Google Terms of Service

Displaying Google reviews requires showing Google branding. This widget includes the Google logo as required. See [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms) for details.
