import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Abdul Rehman | Full Stack Engineer",
    template: "%s | Abdul Rehman",
  },
  description:
    "Full Stack Engineer specializing in AI-powered SaaS platforms, scalable backend systems, and modern web applications.",
  icons: {
    icon: "/pictures/weblogo.png",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}