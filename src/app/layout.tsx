import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ModalProvider } from "@/hooks/useModal";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThreeModeProvider } from "@/hooks/useThreeMode";
import { TerminalProvider } from "@/hooks/useTerminalState";

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
  title: "Nathan Yan | Portfolio",
  description: "Full Stack Developer & AI Researcher",
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
        style={{ backgroundColor: "#181C22", color: "#EEEEEE", visibility: "hidden" }}
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
