import { z } from "zod";

// Server-only environment access. Never import this from a client component —
// these values must not reach the browser bundle. Validation runs lazily at
// request time so `next build` does not require the secrets to be present.

const serverEnvSchema = z.object({
  EMAILJS_SERVICE_ID: z.string().min(1),
  EMAILJS_TEMPLATE_ID: z.string().min(1),
  EMAILJS_PUBLIC_KEY: z.string().min(1),
  EMAILJS_PRIVATE_KEY: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Missing or invalid server environment variables: ${missing}`);
  }
  cached = parsed.data;
  return cached;
}
