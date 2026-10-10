import { InView } from "./in-view";

// Server-rendered inline SVG, themed through CSS tokens (currentColor and
// var(--*)), so it reads in both themes with no image. On narrow screens it
// scrolls horizontally inside its own container — never the page. The
// connectors draw in once on view (CSS, reduced-motion aware).

const W = 960;
const H = 560;

type Box = { x: number; y: number; w: number; h: number; title: string; sub?: string; accent?: boolean };

const consumers: Box[] = [
  { x: 24, y: 48, w: 180, h: 56, title: "Public site", sub: "marketing · catalogue" },
  { x: 24, y: 128, w: 180, h: 56, title: "Customer dashboard", sub: "orders · library · tickets" },
  { x: 24, y: 208, w: 180, h: 56, title: "Admin back office", sub: "catalogue · refunds · door" },
];

const groups: Box[] = [
  { x: 300, y: 48, w: 150, h: 92, title: "Commerce", sub: "catalogue · orders · payments · refunds · invoices · VAT" },
  { x: 470, y: 48, w: 150, h: 92, title: "Bookings", sub: "consultations · workshops · availability · reminders" },
  { x: 300, y: 160, w: 150, h: 92, title: "Events", sub: "capacity · tickets · attendees · check-in" },
  { x: 470, y: 160, w: 150, h: 92, title: "Platform", sub: "auth · roles · audit · storage · settings" },
];

const integrations: Box[] = [
  { x: 756, y: 48, w: 180, h: 44, title: "PayPal REST", sub: "orders · capture · refunds · webhooks" },
  { x: 756, y: 104, w: 180, h: 44, title: "Stripe", sub: "built, deferred" },
  { x: 756, y: 160, w: 180, h: 44, title: "Object storage (S3 API)", sub: "public CDN · presigned private" },
  { x: 756, y: 216, w: 180, h: 44, title: "Video streaming", sub: "signed playback tokens" },
  { x: 756, y: 272, w: 180, h: 44, title: "Newsletter · SMTP", sub: "classified retries" },
];

function Node({ b }: { b: Box }) {
  return (
    <g>
      <rect
        x={b.x}
        y={b.y}
        width={b.w}
        height={b.h}
        rx={8}
        fill={b.accent ? "var(--accent-subtle)" : "var(--bg-elevated)"}
        stroke={b.accent ? "var(--accent)" : "var(--border-strong)"}
        strokeWidth={1}
      />
      <text x={b.x + 12} y={b.y + 22} fill="var(--fg)" fontSize={13} fontWeight={600} fontFamily="var(--font-geist-sans)">
        {b.title}
      </text>
      {b.sub ? (
        <foreignObject x={b.x + 12} y={b.y + 28} width={b.w - 24} height={b.h - 32}>
          <p
            // @ts-expect-error — xmlns is required for foreignObject HTML in SVG
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ margin: 0, fontSize: 10.5, lineHeight: 1.3, color: "var(--fg-subtle)", fontFamily: "var(--font-geist-mono)" }}
          >
            {b.sub}
          </p>
        </foreignObject>
      ) : null}
    </g>
  );
}

export function ArchitectureDiagram() {
  const api: Box = { x: 280, y: 24, w: 360, h: 248, title: "", accent: true };
  const db: Box = { x: 300, y: 320, w: 320, h: 56, title: "PostgreSQL 16 · Prisma 6", sub: "59 models · 82 migrations · row locks · conditional claims · sequences" };
  const jobs: Box = { x: 24, y: 320, w: 220, h: 56, title: "15 scheduled jobs", sub: "holds · reminders · sweeps · digests · retries" };

  return (
    <InView className="draw-in">
      <figure className="not-prose my-6">
        <div className="overflow-x-auto rounded-xl border border-line bg-bg-subtle">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-labelledby="arch-title"
            className="block h-auto min-w-[760px] w-full"
            style={{ maxWidth: W }}
          >
            <title id="arch-title">Architecture: three consumers call one NestJS API of 28 modules on PostgreSQL, with PayPal, storage, video, newsletter and mail integrations, fifteen scheduled jobs and a four-stage CI/CD pipeline</title>

            {/* Column labels */}
            {[
              ["Consumers", 24],
              ["NestJS API · 28 modules · 249 endpoints", 280],
              ["Integrations", 756],
            ].map(([label, x]) => (
              <text key={label as string} x={x as number} y={16} fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-geist-mono)" letterSpacing="0.16em">
                {(label as string).toUpperCase()}
              </text>
            ))}

            {/* API boundary */}
            <rect x={api.x} y={api.y} width={api.w} height={api.h} rx={12} fill="var(--accent-subtle)" stroke="var(--border-accent)" strokeWidth={1} />
            {groups.map((g) => (
              <Node key={g.title} b={g} />
            ))}

            {consumers.map((c) => (
              <Node key={c.title} b={c} />
            ))}
            {integrations.map((i) => (
              <Node key={i.title} b={i} />
            ))}
            <Node b={db} />
            <Node b={jobs} />

            {/* Connectors (drawn in on view) */}
            <g fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round">
              {consumers.map((c, i) => (
                <path
                  key={c.title}
                  data-draw=""
                  d={`M ${c.x + c.w} ${c.y + c.h / 2} C 250 ${c.y + c.h / 2}, 250 ${api.y + 60 + i * 60}, ${api.x} ${api.y + 60 + i * 60}`}
                  style={{ ["--len" as string]: "120", ["--delay" as string]: `${i * 80}ms` }}
                />
              ))}
              {integrations.map((n, i) => (
                <path
                  key={n.title}
                  data-draw=""
                  d={`M ${api.x + api.w} ${api.y + 40 + i * 42} C 700 ${api.y + 40 + i * 42}, 700 ${n.y + n.h / 2}, ${n.x} ${n.y + n.h / 2}`}
                  style={{ ["--len" as string]: "160", ["--delay" as string]: `${240 + i * 80}ms` }}
                />
              ))}
              <path data-draw="" d={`M ${api.x + api.w / 2} ${api.y + api.h} L ${db.x + db.w / 2} ${db.y}`} style={{ ["--len" as string]: "60", ["--delay" as string]: "640ms" }} />
              <path data-draw="" d={`M ${jobs.x + jobs.w} ${jobs.y + jobs.h / 2} L ${db.x} ${db.y + db.h / 2}`} style={{ ["--len" as string]: "60", ["--delay" as string]: "720ms" }} />
            </g>

            {/* Pipeline strip */}
            <g>
              <text x={24} y={420} fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-geist-mono)" letterSpacing="0.16em">
                DELIVERY · PUSH TO MAIN
              </text>
              {["Test · lint · typecheck · build", "Source security scan + gate", "Image build + security gate", "Migrate · deploy · verify"].map((s, i) => (
                <g key={s}>
                  <rect x={24 + i * 232} y={436} width={216} height={56} rx={8} fill="var(--bg-elevated)" stroke="var(--border-strong)" />
                  <text x={36 + i * 232} y={458} fill="var(--fg)" fontSize={12} fontWeight={600} fontFamily="var(--font-geist-sans)">
                    Stage {i + 1}
                  </text>
                  <text x={36 + i * 232} y={478} fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-geist-mono)">
                    {s}
                  </text>
                  {i < 3 ? (
                    <path data-draw="" d={`M ${240 + i * 232} 464 L ${256 + i * 232} 464`} fill="none" stroke="var(--accent)" strokeWidth={1.5} style={{ ["--len" as string]: "16", ["--delay" as string]: `${800 + i * 60}ms` }} />
                  ) : null}
                </g>
              ))}
              <text x={24} y={528} fill="var(--fg-subtle)" fontSize={10.5} fontFamily="var(--font-geist-mono)">
                Stage 4 migrates while the previous container still serves traffic — hence the zero-downtime migration policy.
              </text>
            </g>
          </svg>
        </div>
        <figcaption className="mt-3 text-sm text-fg-muted">
          One NestJS service behind three consumers. Modules are grouped into Commerce, Bookings, Events and Platform; all state is in
          PostgreSQL via Prisma, with capacity and status claims decided in the database. PayPal is the live payment driver; Stripe is
          built and deferred. Fifteen scheduled jobs drive holds, reminders and retries. Scroll sideways on small screens.
        </figcaption>
      </figure>
    </InView>
  );
}
