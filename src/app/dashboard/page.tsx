"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

type LayoutType = "carousel" | "grid" | "masonry" | "list" | "slider" | "badges";

interface Config {
  layout: LayoutType;
  columns: number;
  mobileColumns: number;
  rows: number;
  gap: number;
  autoplay: boolean;
  autoplayMs: number;
  showNav: boolean;
  showDots: boolean;
  showHeader: boolean;
  showWriteReview: boolean;
  showJsonLd: boolean;
  showName: boolean;
  showPhoto: boolean;
  showVerified: boolean;
  showSourceIcon: boolean;
  showDate: boolean;
  showStars: boolean;
  showReply: boolean;
  minStars: number;
  sort: "newest" | "random";
  exclude: string;
  pick: string;
  colorCard: string;
  colorText: string;
  colorMuted: string;
  colorStars: string;
  colorAccent: string;
  fontSizeTitle: number;
  fontSizeBody: number;
  borderRadius: number;
}

const DEFAULTS: Config = {
  layout: "carousel",
  columns: 3,
  mobileColumns: 1,
  rows: 0,
  gap: 16,
  autoplay: false,
  autoplayMs: 4000,
  showNav: true,
  showDots: false,
  showHeader: true,
  showWriteReview: true,
  showJsonLd: true,
  showName: true,
  showPhoto: true,
  showVerified: true,
  showSourceIcon: true,
  showDate: true,
  showStars: true,
  showReply: false,
  minStars: 4,
  sort: "newest",
  exclude: "",
  pick: "",
  colorCard: "#1f2937",
  colorText: "#f3f4f6",
  colorMuted: "#9ca3af",
  colorStars: "#FBBC04",
  colorAccent: "#4285F4",
  fontSizeTitle: 14,
  fontSizeBody: 13,
  borderRadius: 16,
};

// ── URL builder ────────────────────────────────────────────────────────────

function buildParams(cfg: Config): string {
  const p = new URLSearchParams();

  const add = (
    key: string,
    val: string | number | boolean,
    def: string | number | boolean
  ) => {
    if (val !== def) p.set(key, String(val));
  };

  add("layout", cfg.layout, DEFAULTS.layout);
  add("columns", cfg.columns, DEFAULTS.columns);
  add("mobileColumns", cfg.mobileColumns, DEFAULTS.mobileColumns);
  add("rows", cfg.rows, DEFAULTS.rows);
  add("gap", cfg.gap, DEFAULTS.gap);
  add("autoplay", cfg.autoplay, DEFAULTS.autoplay);
  if (cfg.autoplay) add("autoplayMs", cfg.autoplayMs, DEFAULTS.autoplayMs);
  add("showNav", cfg.showNav, DEFAULTS.showNav);
  add("showDots", cfg.showDots, DEFAULTS.showDots);
  add("showHeader", cfg.showHeader, DEFAULTS.showHeader);
  add("showWriteReview", cfg.showWriteReview, DEFAULTS.showWriteReview);
  add("showJsonLd", cfg.showJsonLd, DEFAULTS.showJsonLd);
  add("showName", cfg.showName, DEFAULTS.showName);
  add("showPhoto", cfg.showPhoto, DEFAULTS.showPhoto);
  add("showVerified", cfg.showVerified, DEFAULTS.showVerified);
  add("showSourceIcon", cfg.showSourceIcon, DEFAULTS.showSourceIcon);
  add("showDate", cfg.showDate, DEFAULTS.showDate);
  add("showStars", cfg.showStars, DEFAULTS.showStars);
  add("showReply", cfg.showReply, DEFAULTS.showReply);
  add("minStars", cfg.minStars, DEFAULTS.minStars);
  add("sort", cfg.sort, DEFAULTS.sort);
  if (cfg.exclude.trim()) p.set("exclude", cfg.exclude.trim());
  if (cfg.pick.trim()) p.set("pick", cfg.pick.trim());

  const addColor = (key: string, val: string, def: string) => {
    if (val.toLowerCase() !== def.toLowerCase())
      p.set(key, val.replace("#", ""));
  };
  addColor("colorCard", cfg.colorCard, DEFAULTS.colorCard);
  addColor("colorText", cfg.colorText, DEFAULTS.colorText);
  addColor("colorMuted", cfg.colorMuted, DEFAULTS.colorMuted);
  addColor("colorStars", cfg.colorStars, DEFAULTS.colorStars);
  addColor("colorAccent", cfg.colorAccent, DEFAULTS.colorAccent);

  add("fontSizeTitle", cfg.fontSizeTitle, DEFAULTS.fontSizeTitle);
  add("fontSizeBody", cfg.fontSizeBody, DEFAULTS.fontSizeBody);
  add("borderRadius", cfg.borderRadius, DEFAULTS.borderRadius);

  const qs = p.toString();
  return qs ? `/?${qs}` : "/";
}

// ── Primitive UI components ────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          backgroundColor: checked ? "#4285F4" : "#374151",
          border: "none",
          padding: 0,
          cursor: "pointer",
          position: "relative",
          flexShrink: 0,
          transition: "background-color 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#fff",
            transition: "left 0.2s",
          }}
        />
      </button>
    </label>
  );
}

function RangeInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="font-mono text-xs text-slate-400 tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500 h-1.5"
      />
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-slate-500">{value}</span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "2px solid rgba(255,255,255,0.15)",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              top: -4,
              left: -4,
              width: 36,
              height: 36,
              border: "none",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </label>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-slate-700/60">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-200 select-none">
        {title}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          <polyline points="3,5 7,9 11,5" />
        </svg>
      </summary>
      <div className="flex flex-col gap-3.5 pb-4">{children}</div>
    </details>
  );
}

// ── Layouts metadata ───────────────────────────────────────────────────────

const LAYOUTS: { id: LayoutType; label: string; icon: string }[] = [
  { id: "carousel", label: "Carousel", icon: "⟷" },
  { id: "grid",     label: "Grid",     icon: "⊞" },
  { id: "masonry",  label: "Masonry",  icon: "▦" },
  { id: "list",     label: "List",     icon: "☰" },
  { id: "slider",   label: "Slider",   icon: "▷" },
  { id: "badges",   label: "Badges",   icon: "⬡" },
];

const PREVIEW_BACKGROUNDS = [
  { id: "checker", label: "Transparent" },
  { id: "dark",    label: "Dark"        },
  { id: "light",   label: "Light"       },
  { id: "white",   label: "White"       },
] as const;

type PreviewBg = typeof PREVIEW_BACKGROUNDS[number]["id"];

// ── Main dashboard page ────────────────────────────────────────────────────

export default function Dashboard() {
  const [cfg, setCfg] = useState<Config>(DEFAULTS);
  const [origin, setOrigin] = useState("");
  const [previewPath, setPreviewPath] = useState("/");
  const [previewKey, setPreviewKey] = useState(0);
  const [previewHeight, setPreviewHeight] = useState(320);
  const [previewBg, setPreviewBg] = useState<PreviewBg>("checker");
  const [copied, setCopied] = useState(false);

  // Resolve origin on mount
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const set = useCallback(
    <K extends keyof Config>(key: K, value: Config[K]) =>
      setCfg((prev) => ({ ...prev, [key]: value })),
    []
  );

  // Debounce preview: 800ms after last change
  useEffect(() => {
    const id = setTimeout(() => {
      setPreviewPath(buildParams(cfg));
      setPreviewKey((k) => k + 1);
    }, 800);
    return () => clearTimeout(id);
  }, [cfg]);

  const currentParams = buildParams(cfg);
  const embedUrl = origin ? `${origin}${currentParams}` : currentParams;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(embedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = embedUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const iframeBackground =
    previewBg === "checker"
      ? undefined
      : previewBg === "dark"
      ? "#111827"
      : previewBg === "light"
      ? "#f3f4f6"
      : "#ffffff";

  const checkerStyle =
    previewBg === "checker"
      ? {
          backgroundImage:
            "repeating-conic-gradient(#374151 0% 25%, #1f2937 0% 50%)",
          backgroundSize: "20px 20px",
        }
      : { backgroundColor: iframeBackground };

  const layoutsNeedingColumns = ["carousel", "grid", "masonry"].includes(cfg.layout);

  return (
    <div
      className="flex h-screen overflow-hidden font-sans"
      style={{ backgroundColor: "#0f172a", color: "#e2e8f0" }}
    >
      {/* ── Left: control panel ───────────────────────────────────────── */}
      <aside
        className="flex h-full w-80 flex-shrink-0 flex-col overflow-y-auto border-r border-slate-700/60"
        style={{ backgroundColor: "#1e293b" }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-4">
          <div>
            <h1 className="text-sm font-bold text-white">PaxReviews</h1>
            <p className="text-xs text-slate-400 mt-0.5">Widget configurator</p>
          </div>
          <button
            onClick={() => setCfg(DEFAULTS)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset to defaults"
          >
            Reset
          </button>
        </div>

        {/* Control sections */}
        <div className="flex flex-col px-4 flex-1">

          {/* ── Layout ── */}
          <Section title="Layout">
            {/* Layout picker */}
            <div className="grid grid-cols-3 gap-1.5">
              {LAYOUTS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => set("layout", id)}
                  style={{
                    backgroundColor:
                      cfg.layout === id
                        ? "rgba(66,133,244,0.2)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${cfg.layout === id ? "#4285F4" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 8,
                    padding: "8px 4px",
                    cursor: "pointer",
                    color: cfg.layout === id ? "#93c5fd" : "#94a3b8",
                    transition: "all 0.15s",
                  }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-base leading-none">{icon}</span>
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>

            {layoutsNeedingColumns && (
              <>
                <RangeInput
                  label="Columns (desktop)"
                  value={cfg.columns}
                  min={1}
                  max={6}
                  onChange={(v) => set("columns", v)}
                />
                <RangeInput
                  label="Columns (mobile)"
                  value={cfg.mobileColumns}
                  min={1}
                  max={cfg.columns}
                  onChange={(v) => set("mobileColumns", v)}
                />
              </>
            )}

            <RangeInput
              label={cfg.autoplay ? "Rows per page (0 = auto)" : "Max rows (0 = all)"}
              value={cfg.rows}
              min={0}
              max={10}
              onChange={(v) => set("rows", v)}
            />
            <RangeInput
              label="Gap"
              value={cfg.gap}
              min={0}
              max={48}
              unit="px"
              onChange={(v) => set("gap", v)}
            />
          </Section>

          {/* ── Navigation & Autoplay — available for all layouts ── */}
          <Section title="Autoplay & Navigation">
            <Toggle
              label="Autoplay"
              checked={cfg.autoplay}
              onChange={(v) => set("autoplay", v)}
            />
            {cfg.autoplay && (
              <RangeInput
                label="Autoplay speed"
                value={cfg.autoplayMs}
                min={1000}
                max={10000}
                step={500}
                unit="ms"
                onChange={(v) => set("autoplayMs", v)}
              />
            )}
            <Toggle
              label="Show prev / next arrows"
              checked={cfg.showNav}
              onChange={(v) => set("showNav", v)}
            />
            <Toggle
              label="Show dot / page indicators"
              checked={cfg.showDots}
              onChange={(v) => set("showDots", v)}
            />
          </Section>

          {/* ── Header ── */}
          <Section title="Header">
            <Toggle
              label="Show header"
              checked={cfg.showHeader}
              onChange={(v) => set("showHeader", v)}
            />
            {cfg.showHeader && (
              <Toggle
                label="Write a Review button"
                checked={cfg.showWriteReview}
                onChange={(v) => set("showWriteReview", v)}
              />
            )}
          </Section>

          {/* ── Card elements ── */}
          <Section title="Card Elements">
            <Toggle label="Reviewer photo"   checked={cfg.showPhoto}      onChange={(v) => set("showPhoto", v)} />
            <Toggle label="Reviewer name"    checked={cfg.showName}       onChange={(v) => set("showName", v)} />
            <Toggle label="Star rating"      checked={cfg.showStars}      onChange={(v) => set("showStars", v)} />
            <Toggle label="Date"             checked={cfg.showDate}       onChange={(v) => set("showDate", v)} />
            <Toggle label="Verified badge"   checked={cfg.showVerified}   onChange={(v) => set("showVerified", v)} />
            <Toggle label="Google icon"      checked={cfg.showSourceIcon} onChange={(v) => set("showSourceIcon", v)} />
            <Toggle label="Owner reply"      checked={cfg.showReply}      onChange={(v) => set("showReply", v)} />
          </Section>

          {/* ── Filtering & sorting ── */}
          <Section title="Filtering">
            {/* Min stars */}
            <div>
              <p className="mb-2 text-sm text-slate-300">Min star rating</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => set("minStars", s)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: `1px solid ${cfg.minStars === s ? "#FBBC04" : "rgba(255,255,255,0.1)"}`,
                      backgroundColor:
                        cfg.minStars === s ? "rgba(251,188,4,0.15)" : "transparent",
                      color: cfg.minStars === s ? "#FBBC04" : "#94a3b8",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: 13,
                      transition: "all 0.15s",
                    }}
                  >
                    {s}★
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="mb-1.5 text-sm text-slate-300">Sort order</p>
              <div className="flex gap-1.5">
                {(["newest", "random"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => set("sort", s)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: 8,
                      border: `1px solid ${cfg.sort === s ? "#4285F4" : "rgba(255,255,255,0.1)"}`,
                      backgroundColor:
                        cfg.sort === s ? "rgba(66,133,244,0.15)" : "transparent",
                      color: cfg.sort === s ? "#93c5fd" : "#94a3b8",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 500,
                      textTransform: "capitalize",
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Exclude keywords */}
            <div>
              <label className="text-sm text-slate-300 block mb-1.5">
                Exclude keywords
              </label>
              <input
                type="text"
                value={cfg.exclude}
                onChange={(e) => set("exclude", e.target.value)}
                placeholder="parking, slow, …"
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#e2e8f0",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <p className="mt-1 text-xs text-slate-500">Comma-separated</p>
            </div>

            {/* Pick authors */}
            <div>
              <label className="text-sm text-slate-300 block mb-1.5">
                Show only these reviewers
              </label>
              <input
                type="text"
                value={cfg.pick}
                onChange={(e) => set("pick", e.target.value)}
                placeholder="Jane Smith, John …"
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#e2e8f0",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <p className="mt-1 text-xs text-slate-500">
                Partial name match, comma-separated
              </p>
            </div>
          </Section>

          {/* ── Colors ── */}
          <Section title="Colors">
            <ColorRow label="Card background" value={cfg.colorCard}   onChange={(v) => set("colorCard", v)} />
            <ColorRow label="Text"            value={cfg.colorText}   onChange={(v) => set("colorText", v)} />
            <ColorRow label="Muted text"      value={cfg.colorMuted}  onChange={(v) => set("colorMuted", v)} />
            <ColorRow label="Stars"           value={cfg.colorStars}  onChange={(v) => set("colorStars", v)} />
            <ColorRow label="Accent"          value={cfg.colorAccent} onChange={(v) => set("colorAccent", v)} />
          </Section>

          {/* ── Typography ── */}
          <Section title="Typography" defaultOpen={false}>
            <RangeInput label="Name font size"   value={cfg.fontSizeTitle} min={10} max={24} unit="px" onChange={(v) => set("fontSizeTitle", v)} />
            <RangeInput label="Review font size" value={cfg.fontSizeBody}  min={10} max={20} unit="px" onChange={(v) => set("fontSizeBody", v)} />
            <RangeInput label="Card radius"      value={cfg.borderRadius}  min={0}  max={32} unit="px" onChange={(v) => set("borderRadius", v)} />
          </Section>

          {/* ── SEO ── */}
          <Section title="SEO" defaultOpen={false}>
            <Toggle
              label="Inject Schema.org JSON-LD"
              checked={cfg.showJsonLd}
              onChange={(v) => set("showJsonLd", v)}
            />
            <p className="text-xs text-slate-500 leading-relaxed">
              Adds AggregateRating markup for Google rich snippets. Note: in Framer, paste the JSON-LD into Custom Code → Head for it to be indexed.
            </p>
          </Section>

          <div className="py-4" />
        </div>
      </aside>

      {/* ── Right: preview + URL ───────────────────────────────────────── */}
      <main className="flex flex-1 flex-col overflow-hidden">

        {/* URL bar */}
        <div
          className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-3"
          style={{ backgroundColor: "#162032" }}
        >
          <div
            className="flex flex-1 items-center gap-2 overflow-hidden rounded-lg px-3 py-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-xs text-slate-500 flex-shrink-0">URL</span>
            <span className="font-mono text-xs text-slate-300 truncate flex-1 select-all">
              {embedUrl || currentParams}
            </span>
          </div>

          <button
            onClick={copyUrl}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "none",
              backgroundColor: copied ? "#16a34a" : "#4285F4",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.2s",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "✓ Copied" : "Copy URL"}
          </button>

          <a
            href={currentParams}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              backgroundColor: "transparent",
              color: "#94a3b8",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "none",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            Open ↗
          </a>
        </div>

        {/* Preview toolbar */}
        <div
          className="flex items-center gap-4 border-b border-slate-700/60 px-4 py-2"
          style={{ backgroundColor: "#162032" }}
        >
          {/* Background picker */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 mr-1">Background</span>
            {PREVIEW_BACKGROUNDS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setPreviewBg(id)}
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  border: `1px solid ${previewBg === id ? "#4285F4" : "rgba(255,255,255,0.1)"}`,
                  backgroundColor:
                    previewBg === id ? "rgba(66,133,244,0.15)" : "transparent",
                  color: previewBg === id ? "#93c5fd" : "#64748b",
                  fontSize: 11,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Height control */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500">Height</span>
            <input
              type="range"
              min={160}
              max={800}
              step={20}
              value={previewHeight}
              onChange={(e) => setPreviewHeight(Number(e.target.value))}
              className="w-28 accent-blue-500 h-1.5"
            />
            <span className="font-mono text-xs text-slate-400 w-12 tabular-nums">
              {previewHeight}px
            </span>
          </div>

          {/* Manual refresh */}
          <button
            onClick={() => {
              setPreviewPath(buildParams(cfg));
              setPreviewKey((k) => k + 1);
            }}
            style={{
              padding: "3px 10px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "transparent",
              color: "#64748b",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            ↺ Refresh
          </button>
        </div>

        {/* Iframe preview */}
        <div className="flex-1 overflow-auto p-6">
          <div
            className="relative mx-auto w-full overflow-hidden rounded-xl"
            style={{
              ...checkerStyle,
              height: previewHeight,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
            }}
          >
            {origin ? (
              <iframe
                key={previewKey}
                src={`${origin}${previewPath}`}
                className="h-full w-full border-0"
                title="Widget preview"
                style={{ display: "block" }}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
              </div>
            )}
          </div>

          {/* Framer embed hint */}
          <div
            className="mx-auto mt-4 w-full rounded-lg px-4 py-3"
            style={{
              backgroundColor: "rgba(66,133,244,0.08)",
              border: "1px solid rgba(66,133,244,0.2)",
            }}
          >
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-blue-400">Framer embed:</span>{" "}
              In Framer, click <strong className="text-slate-300">+</strong> → <strong className="text-slate-300">Embed</strong>, paste the URL above, and set the height to match your preview height ({previewHeight}px).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
