import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/hooks/useModal";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThreeModeProvider } from "@/hooks/useThreeMode";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}>
        <ThemeProvider>
          <ModalProvider>
            <ThreeModeProvider>
              {children}
            </ThreeModeProvider>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
