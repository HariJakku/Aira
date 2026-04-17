import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIRA – Curate Your Joy",
  description:
    "AIRA is a premium event gifting platform that curates personalised gift experiences for every occasion — birthdays, weddings, housewarmings and more.",
  keywords: ["event gifting", "curated gifts", "AIRA", "gift supplies", "event management"],
  authors: [{ name: "AIRA" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AIRA",
  },
  openGraph: {
    title: "AIRA – Curate Your Joy",
    description: "Premium event gifting platform",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B7355",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
