import type { ReactNode } from "react";
import ClientLayout from "@/components/layout/ClientLayout";

// The site shell (navbar, loader, background, footer) applies only to routes in
// this group. Standalone routes such as /styleguide live outside it.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
