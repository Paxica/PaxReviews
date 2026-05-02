# PaxReviews — Google Reviews Widget for Framer

A Next.js widget that fetches Google Reviews server-side and renders them as a fully-configurable, embeddable widget. Deploy once to Vercel and control every option via URL query parameters — no redeployment needed to change layout, colors, or filters.

---

## How it works

- Reviews are fetched **server-side** via the Google Places API — your API key is never sent to the browser.
- Results are cached in-memory for **24 hours**.
- All display options are controlled via **URL query parameters**, so one deployment supports unlimited embed variants.
- Background is transparent — the widget adapts to your Framer page background.

---

## 1. Get your Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Places API** under *APIs & Services → Library*.
3. Go to *Credentials*, click **Create Credentials → API Key**.
4. Under **Application restrictions**, select **None**.
5. Under **API restrictions**, restrict to **Places API** only.
6. Save and copy the key.

> **Important:** Use **None** for Application restrictions (not HTTP referrers), because the API is called server-side and has no browser referer header.

---

## 2. Find your Place ID

1. Visit the [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder).
2. Search for your business — the Place ID appears in the info window (e.g. `ChIJN1t_tDeuEmsR...`).

---

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

```env
GOOGLE_PLACES_API_KEY=AIza...
GOOGLE_PLACE_ID=ChIJ...
MIN_STAR_RATING=4        # server-side default; overridable via ?minStars=
```

---

## 4. Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

---

## 5. Deploy to Vercel

### Vercel CLI
```bash
npm i -g vercel && vercel
```

### Vercel Dashboard
1. Push to GitHub → import at [vercel.com/new](https://vercel.com/new).
2. Add the three environment variables.
3. Deploy.

---

## 6. Embed in Framer

1. **+** → **Embed** in the Framer left panel.
2. Paste your URL with query params (see below).
3. Set a fixed height (recommended **280–340 px** for carousel/slider, **auto** for grid/list).

---

## URL Parameter Reference

Every option is a query parameter. Combine as many as you need:

```
https://your-project.vercel.app/?layout=grid&columns=3&colorAccent=ff6b35&sort=random
```

### Layout

| Param | Values | Default | Description |
|---|---|---|---|
| `layout` | `carousel` `grid` `masonry` `list` `slider` `badges` | `carousel` | Display layout |
| `columns` | `1`–`6` | `3` | Cards per row (grid/masonry/carousel) |
| `mobileColumns` | `1`–`6` | `1` | Columns on screens ≤640 px |
| `rows` | `0`–N | `0` | Max rows to show (0 = unlimited). Grid/masonry: `rows × columns` cards. List/slider/badges: `rows` cards. |
| `gap` | `0`–`64` | `16` | Spacing between cards in px |
| `autoplay` | `true` `false` | `false` | Auto-advance carousel/slider |
| `autoplayMs` | ms | `4000` | Autoplay interval in milliseconds |
| `showNav` | `true` `false` | `true` | Show prev/next navigation buttons |
| `showDots` | `true` `false` | `false` | Show dot indicators (slider only) |

### Header

| Param | Values | Default | Description |
|---|---|---|---|
| `showHeader` | `true` `false` | `true` | Show overall rating + business name |
| `showWriteReview` | `true` `false` | `true` | Show "Write a Review" button |
| `writeReviewUrl` | URL | auto | Override the Write a Review link |

### Filtering & Sorting

| Param | Values | Default | Description |
|---|---|---|---|
| `minStars` | `1`–`5` | `4` | Minimum star rating to display |
| `sort` | `newest` `random` | `newest` | Sort order |
| `exclude` | `word,phrase,...` | — | Hide reviews containing these keywords (comma-separated, case-insensitive) |
| `pick` | `name,name,...` | — | Show only reviews from these reviewer names (partial match, comma-separated) |

### Card Elements

| Param | Default | Description |
|---|---|---|
| `showName` | `true` | Reviewer name |
| `showPhoto` | `true` | Reviewer profile photo |
| `showVerified` | `true` | "Verified" badge |
| `showSourceIcon` | `true` | Google G icon |
| `showDate` | `true` | Relative date ("2 months ago") |
| `showStars` | `true` | Per-card star rating |
| `showReply` | `false` | Owner's reply (if any) |

### Schema / SEO

| Param | Default | Description |
|---|---|---|
| `showJsonLd` | `true` | Inject Schema.org `AggregateRating` JSON-LD for rich snippets |

### Styling

Colors are hex values — with or without the `#` prefix:

| Param | Default | Description |
|---|---|---|
| `colorCard` | `1f2937` | Card background |
| `colorText` | `f3f4f6` | Primary text |
| `colorMuted` | `9ca3af` | Secondary text (date, owner response label) |
| `colorStars` | `FBBC04` | Star fill color |
| `colorAccent` | `4285F4` | Buttons, links, verified badge, avatar fallback |
| `fontSizeTitle` | `14` | Reviewer name font size in px |
| `fontSizeBody` | `13` | Review text font size in px |
| `borderRadius` | `16` | Card corner radius in px |

---

## Layout Examples

**Horizontal carousel, 3 cards, autoplay every 5 s:**
```
/?layout=carousel&columns=3&autoplay=true&autoplayMs=5000
```

**2-column grid, minimal card, custom colours:**
```
/?layout=grid&columns=2&showVerified=false&showSourceIcon=false&colorCard=0f172a&colorAccent=6366f1
```

**Full-width masonry, 4 columns desktop / 2 mobile:**
```
/?layout=masonry&columns=4&mobileColumns=2
```

**Single-card slider with dots:**
```
/?layout=slider&showDots=true&autoplay=true
```

**Compact badges row:**
```
/?layout=badges&showHeader=false
```

**Handpick specific reviewers:**
```
/?pick=Jane+Smith,John+Doe
```

**Exclude reviews mentioning specific words:**
```
/?exclude=parking,slow
```

---

## Schema / SEO note

When `showJsonLd=true` (default), a `<script type="application/ld+json">` block containing Schema.org `LocalBusiness` + `AggregateRating` markup is injected into the page. When Framer embeds the widget in an iframe, this markup lives inside the iframe document — search engines indexing the parent Framer page won't see it. To get rich snippets on the Framer page itself, copy the JSON-LD and add it to Framer's **Custom Code** → **Head** section manually.

---

## Caching

Reviews are cached in-memory for 24 hours per Vercel serverless instance. A new deployment resets the cache. For persistent cross-instance caching, replace the module-level cache in `src/lib/reviews.ts` with [Vercel KV](https://vercel.com/docs/storage/vercel-kv).

---

## Project Structure

```
src/
  app/
    page.tsx                   ← awaits searchParams, builds config, renders widget
    layout.tsx
    globals.css
    api/reviews/route.ts       ← optional direct JSON endpoint
  lib/
    config.ts                  ← WidgetConfig type + parseConfig()
    reviews.ts                 ← Google Places API fetch + 24 h cache
    filterReviews.ts           ← pure filter/sort/cap function
  components/
    ReviewsWidget.tsx          ← async server component, routes to layout
    WidgetHeader.tsx           ← overall rating + Write a Review button
    ReviewCard.tsx             ← individual card, all elements toggleable
    StarRating.tsx             ← SVG stars with configurable color
    GoogleLogo.tsx             ← Google branding (required by ToS)
    JsonLd.tsx                 ← Schema.org JSON-LD script tag
    layouts/
      CarouselLayout.tsx       ← horizontal scroll, autoplay, prev/next
      GridLayout.tsx           ← CSS grid, responsive columns
      MasonryLayout.tsx        ← CSS columns masonry
      ListLayout.tsx           ← vertical stack
      SliderLayout.tsx         ← one-at-a-time with dots + autoplay
      BadgesLayout.tsx         ← compact star + name badges
```

---

## Google Terms of Service

All Google reviews widgets must display Google branding. This widget includes the Google logo in the header. See the [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms).
