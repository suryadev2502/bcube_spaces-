import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "BCUBE SPACES — Find Your Space. Build Your Future.", template: "%s | BCUBE SPACES" },
  description: "Discover residential, commercial, and investment opportunities across Hyderabad and beyond — from inside the ORR to the RRR corridor.",
  openGraph: { siteName: "BCUBE SPACES", type: "website", locale: "en_IN" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#0E0E0F", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
