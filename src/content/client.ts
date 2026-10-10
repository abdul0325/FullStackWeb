// The one place the case-study client is identified. The build is anonymised
// until naming is confirmed (plan §9); flipping `named` to true and filling
// the fields turns every "a UK founder's platform" into the real name, URL
// and logo — a content swap, no component changes.

export const caseStudyClient = {
  named: false as boolean,
  /** Shown when `named` is true. */
  name: "",
  /** Public site, shown when `named` is true. */
  url: "",
  /** Public API host, shown when `named` is true. Never shown otherwise. */
  apiHost: "",
  /** Path under /public, optional. */
  logo: "" as string | "",
  /** Anonymised wording — CV notes §H. */
  anonymous: {
    short: "a UK founder's commerce and events platform",
    long: "a UK founder's commerce and events platform — a shop, courses, consultations, workshops, and events with ticketing",
  },
} as const;

/** How the client is referred to in running text. */
export function clientRef(form: "short" | "long" = "short"): string {
  return caseStudyClient.named ? caseStudyClient.name : caseStudyClient.anonymous[form];
}
