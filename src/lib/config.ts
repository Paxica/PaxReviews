export type LayoutType = "carousel" | "grid" | "masonry" | "list" | "slider" | "badges";
export type SortOrder = "newest" | "random";

export interface CardElements {
  showName: boolean;
  showPhoto: boolean;
  showVerified: boolean;
  showSourceIcon: boolean;
  showDate: boolean;
  showStars: boolean;
  showReply: boolean;
}

export interface WidgetConfig {
  layout: LayoutType;

  // Card element toggles
  elements: CardElements;

  // Header
  showHeader: boolean;
  showWriteReview: boolean;
  writeReviewUrl: string;

  // Schema
  showJsonLd: boolean;

  // Filtering & sorting
  minStars: number;
  excludeKeywords: string[];
  pickAuthors: string[];
  sort: SortOrder;

  // Layout controls
  columns: number;
  mobileColumns: number;
  rows: number;
  gap: number;
  autoplay: boolean;
  autoplayMs: number;
  showNav: boolean;
  showDots: boolean;

  // Styling — stored as full hex strings (e.g. "#1f2937")
  colorCard: string;
  colorText: string;
  colorMuted: string;
  colorStars: string;
  colorAccent: string;

  fontSizeTitle: number;
  fontSizeBody: number;
  borderRadius: number;
}

type Params = Record<string, string | string[] | undefined>;

function str(p: Params, key: string, fallback: string): string {
  const v = p[key];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : fallback;
}

function num(p: Params, key: string, fallback: number): number {
  const n = parseInt(str(p, key, ""), 10);
  return isNaN(n) ? fallback : n;
}

function bool(p: Params, key: string, fallback: boolean): boolean {
  if (!(key in p)) return fallback;
  const v = str(p, key, "");
  return v !== "false" && v !== "0";
}

function csv(p: Params, key: string): string[] {
  const v = str(p, key, "");
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function hex(p: Params, key: string, fallback: string): string {
  const v = str(p, key, "");
  if (!v) return fallback;
  const raw = v.startsWith("#") ? v.slice(1) : v;
  return /^[0-9a-fA-F]{3,8}$/.test(raw) ? `#${raw}` : fallback;
}

const LAYOUTS: LayoutType[] = ["carousel", "grid", "masonry", "list", "slider", "badges"];

export function parseConfig(params: Params, placeId: string): WidgetConfig {
  const rawLayout = str(params, "layout", "carousel");
  const layout: LayoutType = LAYOUTS.includes(rawLayout as LayoutType)
    ? (rawLayout as LayoutType)
    : "carousel";

  const columns = Math.min(6, Math.max(1, num(params, "columns", 3)));
  const mobileColumns = Math.min(columns, Math.max(1, num(params, "mobileColumns", 1)));

  const writeReviewUrl =
    str(params, "writeReviewUrl", "") ||
    (placeId
      ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`
      : "");

  return {
    layout,

    elements: {
      showName:       bool(params, "showName", true),
      showPhoto:      bool(params, "showPhoto", true),
      showVerified:   bool(params, "showVerified", true),
      showSourceIcon: bool(params, "showSourceIcon", true),
      showDate:       bool(params, "showDate", true),
      showStars:      bool(params, "showStars", true),
      showReply:      bool(params, "showReply", false),
    },

    showHeader:      bool(params, "showHeader", true),
    showWriteReview: bool(params, "showWriteReview", true),
    writeReviewUrl,
    showJsonLd:      bool(params, "showJsonLd", true),

    minStars:        Math.min(5, Math.max(1, num(params, "minStars", 4))),
    excludeKeywords: csv(params, "exclude"),
    pickAuthors:     csv(params, "pick"),
    sort:            str(params, "sort", "newest") === "random" ? "random" : "newest",

    columns,
    mobileColumns,
    rows:       Math.max(0, num(params, "rows", 0)),
    gap:        Math.min(64, Math.max(0, num(params, "gap", 16))),
    autoplay:   bool(params, "autoplay", false),
    autoplayMs: Math.max(1000, num(params, "autoplayMs", 4000)),
    showNav:    bool(params, "showNav", true),
    showDots:   bool(params, "showDots", false),

    colorCard:   hex(params, "colorCard",  "#1f2937"),
    colorText:   hex(params, "colorText",  "#f3f4f6"),
    colorMuted:  hex(params, "colorMuted", "#9ca3af"),
    colorStars:  hex(params, "colorStars", "#FBBC04"),
    colorAccent: hex(params, "colorAccent","#4285F4"),

    fontSizeTitle: Math.min(32, Math.max(8, num(params, "fontSizeTitle", 14))),
    fontSizeBody:  Math.min(32, Math.max(8, num(params, "fontSizeBody",  13))),
    borderRadius:  Math.min(32, Math.max(0, num(params, "borderRadius",  16))),
  };
}
