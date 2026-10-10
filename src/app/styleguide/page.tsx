import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight, Check, Download, Code2, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  LinkCard,
} from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { TextLink } from "@/components/ui/text-link";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { duration, ease, stagger, distance } from "@/lib/motion";

// Hidden review surface for the design system. Not linked, not indexed, not in
// the sitemap. Every token, type size and primitive in every state, in both
// themes side by side.

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false, nocache: true },
};

// [utility name, role, raw CSS variable]. @theme inline does not emit --color-*
// custom properties, so swatches read the underlying token directly.
const COLOR_TOKENS = [
  ["bg", "Page background", "--bg"],
  ["bg-subtle", "Raised surface", "--bg-subtle"],
  ["bg-elevated", "Cards, popovers", "--bg-elevated"],
  ["bg-inset", "Wells, code", "--bg-inset"],
  ["fg", "Primary text", "--fg"],
  ["fg-muted", "Secondary text", "--fg-muted"],
  ["fg-subtle", "Captions, labels", "--fg-subtle"],
  ["fg-faint", "Disabled, watermark", "--fg-faint"],
  ["line", "Border (decorative)", "--border"],
  ["line-strong", "Border (control)", "--border-strong"],
  ["brand", "Accent", "--accent"],
  ["brand-hover", "Accent hover", "--accent-hover"],
  ["brand-pressed", "Accent pressed", "--accent-pressed"],
  ["brand-subtle", "Accent tint", "--accent-subtle"],
  ["success", "Success", "--success"],
  ["warning", "Warning", "--warning"],
  ["danger", "Danger", "--danger"],
] as const;

const TYPE_SCALE = [
  ["text-display", "Display", "clamp(2.75rem, 1.5rem + 5.5vw, 5.5rem)"],
  ["text-h1", "Heading 1", "clamp(2.25rem, 1.4rem + 3.6vw, 3.5rem)"],
  ["text-h2", "Heading 2", "clamp(1.75rem, 1.3rem + 2vw, 2.5rem)"],
  ["text-h3", "Heading 3", "clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)"],
  ["text-body-lg", "Lead", "1.125rem / 1.7"],
  ["text-body", "Body", "1rem / 1.65"],
  ["text-sm", "Small", "0.875rem"],
  ["label", "Mono label", "0.75rem, tracked 0.18em"],
] as const;

export default function StyleguidePage() {
  return (
    <main className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="min-w-0">
            <p className="label">Design system</p>
            <h1 className="truncate text-h3">Styleguide</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-fg-subtle sm:inline">Toggle the page theme →</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1600px] px-5 py-8 md:px-8">
        <p className="measure text-body-lg text-fg-muted">
          Both themes render side by side below, independent of the page theme. Hover,
          focus and active states are live — use a pointer or the keyboard on any control.
          Disabled and loading states are shown explicitly.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ThemePanel theme="dark" />
          <ThemePanel theme="light" />
        </div>
      </div>
    </main>
  );
}

/* ----------------------------------------------------------------------- */

function ThemePanel({ theme }: { theme: "dark" | "light" }) {
  return (
    <section
      data-theme={theme}
      aria-label={`${theme} theme`}
      className="min-w-0 overflow-hidden rounded-2xl border border-line bg-bg text-fg"
    >
      <div className="border-b border-line bg-bg-subtle px-5 py-3 md:px-6">
        <p className="label">{theme} theme</p>
      </div>

      <div className="flex flex-col gap-12 px-5 py-8 md:px-6">
        <Colors />
        <Typography />
        <Buttons />
        <Links />
        <Badges />
        <Cards />
        <Fields />
        <Motion />
        <Radii />
      </div>
    </section>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-h3">{title}</h2>
        {hint ? <p className="text-sm text-fg-subtle">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Colors() {
  return (
    <Section title="Colour tokens" hint="Contrast matrix in docs/CONTRAST.md — every text token ≥ 4.5:1 on every surface.">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {COLOR_TOKENS.map(([token, role, cssVar]) => (
          <li key={token} className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="size-10 shrink-0 rounded-md border border-line-strong/50"
              style={{ background: `var(${cssVar})` }}
            />
            <span className="min-w-0">
              <span className="block truncate font-mono text-xs text-fg">{token}</span>
              <span className="block truncate text-xs text-fg-subtle">{role}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-fg">brand-fg on brand</span>
        <span className="rounded-md bg-bg-inset px-3 py-1.5 font-mono text-sm text-fg-muted">fg-muted on bg-inset</span>
        <span className="rounded-md bg-bg-subtle px-3 py-1.5 text-sm text-fg-subtle">fg-subtle on bg-subtle</span>
      </div>
    </Section>
  );
}

function Typography() {
  return (
    <Section title="Type scale" hint="Geist Sans + Geist Mono. Headings are clamp()-only; body never drops below 1rem.">
      <div className="flex flex-col gap-5 overflow-hidden">
        {TYPE_SCALE.map(([cls, name, value]) => (
          <div key={cls} className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span className="font-mono text-xs text-fg-subtle">{name}</span>
              <span className="font-mono text-xs text-fg-faint">{value}</span>
            </div>
            <p className={`${cls} break-words text-fg`}>
              {cls === "label" ? "Available for projects" : "Precision engineering"}
            </p>
          </div>
        ))}
        <div className="rounded-md bg-bg-inset p-4">
          <p className="measure text-body text-fg-muted">
            Body copy sits at a 68-character measure so a line never runs too long on a wide
            display. Monospace carries data — <code className="text-fg">249 endpoints</code>,{" "}
            <code className="text-fg">829 tests</code> — never prose.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Buttons() {
  const variants = ["primary", "secondary", "ghost", "destructive", "link"] as const;
  return (
    <Section title="Buttons" hint="Rest · hover (pointer) · focus-visible (keyboard) · active · disabled · loading">
      <div className="flex flex-col gap-4">
        {variants.map((v) => (
          <div key={v} className="flex flex-col gap-2">
            <span className="font-mono text-xs text-fg-subtle">{v}</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant={v}>
                Rest <ArrowRight />
              </Button>
              <Button variant={v} disabled>
                Disabled
              </Button>
              <Button variant={v} loading>
                Loading
              </Button>
              {v !== "link" ? (
                <Button variant={v} size="icon" aria-label="Icon example">
                  <Mail />
                </Button>
              ) : null}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-fg-subtle">sizes</span>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">
              <Download /> Large
            </Button>
            <Button size="icon-sm" variant="secondary" aria-label="Small icon">
              <Code2 />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Icon">
              <Code2 />
            </Button>
            <Button size="icon-lg" variant="secondary" aria-label="Large icon">
              <Code2 />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Links() {
  return (
    <Section title="Links" hint="inline · nav (aria-current) · subtle · external">
      <p className="measure text-body text-fg-muted">
        An <TextLink href="/styleguide">inline link</TextLink> inside prose, a{" "}
        <TextLink href="https://github.com/abdul0325">link that opens elsewhere</TextLink>, and
        a <TextLink href="/styleguide" variant="subtle">subtle link</TextLink> for secondary actions.
      </p>
      <nav aria-label="Example" className="flex flex-wrap gap-5 text-sm">
        <TextLink href="/styleguide" variant="nav" aria-current="true">
          Active
        </TextLink>
        <TextLink href="/styleguide" variant="nav">
          Projects
        </TextLink>
        <TextLink href="/styleguide" variant="nav">
          Contact
        </TextLink>
      </nav>
    </Section>
  );
}

function Badges() {
  return (
    <Section title="Badges" hint="neutral · brand · status (dot) · semantic">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Next.js</Badge>
        <Badge>PostgreSQL</Badge>
        <Badge variant="brand">249 endpoints</Badge>
        <Badge variant="status" dot>
          Available
        </Badge>
        <Badge variant="status" dot="warning">
          Limited
        </Badge>
        <Badge variant="success">
          <Check /> Passing
        </Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="danger">Failed</Badge>
        <Badge size="sm">small</Badge>
        <Badge size="lg">large</Badge>
      </div>
    </Section>
  );
}

function Cards() {
  return (
    <Section title="Cards" hint="static · interactive (hover lift) · linked (whole card is one anchor)">
      <div className="grid gap-4 @container sm:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="label">Static</p>
            <CardTitle>Elevation by background</CardTitle>
            <CardDescription>Border and surface step, no shadow at rest.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-fg-muted">Content sits on bg-elevated with a 1px top highlight.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="secondary">
              Action
            </Button>
          </CardFooter>
        </Card>
        <Card variant="interactive">
          <CardHeader>
            <p className="label">Interactive</p>
            <CardTitle>Lifts 2px on hover</CardTitle>
            <CardDescription>Transform plus a shadow layer whose opacity animates.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-fg-muted">Nothing repaints; the shadow is pre-rendered.</p>
          </CardContent>
        </Card>
        <LinkCard href="/styleguide" className="sm:col-span-2">
          <CardHeader>
            <p className="label">Linked</p>
            <CardTitle className="flex items-center gap-2">
              The whole card is the link <ArrowRight className="size-4 text-brand" />
            </CardTitle>
            <CardDescription>Focus ring sits on the card. Text stays selectable.</CardDescription>
          </CardHeader>
        </LinkCard>
      </div>
    </Section>
  );
}

function Fields() {
  return (
    <Section title="Inputs" hint="rest · hover · focus · filled · invalid · read-only · disabled">
      <form className="grid gap-5 sm:grid-cols-2" onSubmit={undefined} noValidate>
        <Field id="sg-name" label="Full name" required>
          <Input placeholder="Alex Rivera" autoComplete="name" />
        </Field>
        <Field id="sg-filled" label="Filled">
          <Input defaultValue="hello@example.com" autoComplete="email" />
        </Field>
        <Field id="sg-invalid" label="Invalid" error="Enter a valid email address.">
          <Input defaultValue="not-an-email" />
        </Field>
        <Field id="sg-hint" label="With hint" hint="We reply within two working days.">
          <Input placeholder="Project discussion" />
        </Field>
        <Field id="sg-readonly" label="Read only">
          <Input defaultValue="PKT (UTC+5)" readOnly />
        </Field>
        <Field id="sg-disabled" label="Disabled">
          <Input placeholder="Unavailable" disabled />
        </Field>
        <Field id="sg-message" label="Message" className="sm:col-span-2">
          <Textarea placeholder="Tell me about your project…" />
        </Field>
      </form>
    </Section>
  );
}

function Motion() {
  return (
    <Section title="Motion tokens" hint="Transform and opacity only. Reduced motion collapses every value to zero.">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs sm:grid-cols-3">
        <dt className="text-fg-subtle">ease.out</dt>
        <dd className="text-fg sm:col-span-2">cubic-bezier({ease.out.join(", ")})</dd>
        <dt className="text-fg-subtle">ease.inOut</dt>
        <dd className="text-fg sm:col-span-2">cubic-bezier({ease.inOut.join(", ")})</dd>
        <dt className="text-fg-subtle">spring</dt>
        <dd className="text-fg sm:col-span-2">420 / 32 / 0.7</dd>
        {Object.entries(duration).map(([k, v]) => (
          <DlRow key={k} k={`duration.${k}`} v={`${v}s`} />
        ))}
        {Object.entries(stagger).map(([k, v]) => (
          <DlRow key={k} k={`stagger.${k}`} v={`${v}s`} />
        ))}
        {Object.entries(distance).map(([k, v]) => (
          <DlRow key={k} k={`distance.${k}`} v={`${v}px`} />
        ))}
      </dl>
      <div className="flex flex-wrap gap-3">
        {(
          [
            ["instant", "duration-instant"],
            ["fast", "duration-fast"],
            ["base", "duration-base"],
            ["slow", "duration-slow"],
          ] as const
        ).map(([d, cls]) => (
          <button
            key={d}
            type="button"
            className={`rounded-md border border-line bg-bg-subtle px-3 py-2 font-mono text-xs text-fg-muted transition-transform ease-out-expo hoverable:hover:-translate-y-1 ${cls}`}
          >
            hover: {d}
          </button>
        ))}
      </div>
    </Section>
  );
}

function DlRow({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-fg-subtle">{k}</dt>
      <dd className="text-fg sm:col-span-2">{v}</dd>
    </>
  );
}

function Radii() {
  const radii = [
    ["sm", "rounded-sm"],
    ["md", "rounded-md"],
    ["lg", "rounded-lg"],
    ["xl", "rounded-xl"],
    ["2xl", "rounded-2xl"],
  ] as const;
  return (
    <Section title="Radius & shadow" hint="Base 0.75rem. Cards xl, buttons md, badges full. Two shadows exist: lift and popover.">
      <div className="flex flex-wrap items-end gap-4">
        {radii.map(([r, cls]) => (
          <div key={r} className="flex flex-col items-center gap-2">
            <div className={`size-14 border border-line-strong bg-bg-subtle ${cls}`} />
            <span className="font-mono text-xs text-fg-subtle">{r}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <div className="size-14 rounded-xl bg-bg-elevated shadow-lift" />
          <span className="font-mono text-xs text-fg-subtle">lift</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="size-14 rounded-xl bg-bg-elevated shadow-popover" />
          <span className="font-mono text-xs text-fg-subtle">popover</span>
        </div>
      </div>
    </Section>
  );
}
