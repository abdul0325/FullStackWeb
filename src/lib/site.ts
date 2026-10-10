// The one place the public origin is defined. metadataBase, canonical URLs,
// Open Graph URLs, the sitemap and JSON-LD all read SITE_URL, so a domain
// change is a one-line edit (or an env var in Vercel).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulfullstackdev.vercel.app"
).replace(/\/+$/, "");
