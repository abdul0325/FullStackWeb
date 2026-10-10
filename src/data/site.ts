// Single source of truth for identity, links and availability. Every section
// that shows a name, an email, a social link or the availability badge reads
// from here. Content that still needs confirming is marked in
// docs/PORTFOLIO-UPGRADE-PLAN.md §9.

export const site = {
  name: "Abdul Rehman",
  role: "Backend Engineer",
  /** One sentence, the ten-second read. Draft pending approval (§9). */
  positioning:
    "I build commerce systems where correctness is the product.",
  email: "abdulrehman.fullstackdev@gmail.com",
  location: {
    city: "Bahawalpur",
    country: "Pakistan",
    timezone: "Asia/Karachi",
    timezoneLabel: "PKT (UTC+5)",
    remote: true,
    relocation: true,
  },
  availability: {
    /** Shown on the badge. Wording pending confirmation (§9). */
    label: "Open to backend & full-stack roles",
    open: true,
  },
  socials: {
    github: "https://github.com/abdul0325",
    linkedin: "https://www.linkedin.com/in/abdul-rehman-961428265/",
  },
  resumePdf: "/resume/AbdulRehman_FullStack.pdf",
} as const;

export type Site = typeof site;
