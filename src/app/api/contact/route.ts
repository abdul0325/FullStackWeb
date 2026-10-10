import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";

// POST /api/contact — validates, rate-limits and forwards the contact form to
// EmailJS from the server, so no EmailJS key ever reaches the browser.

export const runtime = "nodejs";

const MIN_FILL_TIME_MS = 2_000; // anything faster than this is a bot
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX = 5;

// In-memory per-IP limiter. Per serverless instance, which is sufficient for a
// portfolio contact form; swap for a KV-backed store if abuse ever appears.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

const bodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(5_000),
  // Honeypot: a real user never fills this field. Accepted by the schema so a bot
  // that fills it gets the same "ok" response as everyone else, never a hint.
  company: z.string().max(500).optional(),
  // Set by the form on mount; used for the minimum fill-time check.
  startedAt: z.coerce.number().int().positive(),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid input", issues: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 400 }
    );
  }

  const { name, email, subject, message, company, startedAt } = parsed.data;

  // Honeypot filled or submitted too fast: pretend success so bots learn nothing.
  if ((company && company.length > 0) || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: true });
  }

  let env;
  try {
    env = getServerEnv();
  } catch (error) {
    console.error("[contact] env error:", error);
    return NextResponse.json({ ok: false, error: "Mail service not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_PUBLIC_KEY,
      accessToken: env.EMAILJS_PRIVATE_KEY,
      template_params: { name, email, subject, message },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[contact] EmailJS error:", res.status, text.slice(0, 200));
    return NextResponse.json({ ok: false, error: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
