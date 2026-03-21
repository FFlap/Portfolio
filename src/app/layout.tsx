import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ModalProvider } from "@/hooks/useModal";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThreeModeProvider } from "@/hooks/useThreeMode";
import { TerminalProvider } from "@/hooks/useTerminalState";
import { siteConfig } from "@/lib/seo";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.siteName,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "/",
    siteName: siteConfig.siteName,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        alt: "Portrait of Nathan Yan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "#181C22" }}>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
        style={{ backgroundColor: "#181C22", color: "#EEEEEE" }}
      >
        <ThemeProvider>
          <TerminalProvider>
            <ModalProvider>
              <ThreeModeProvider>
                <AppShell>{children}</AppShell>
              </ThreeModeProvider>
            </ModalProvider>
          </TerminalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
