import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/hooks/useModal";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThreeModeProvider } from "@/hooks/useThreeMode";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
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
      <body className={`${jetbrainsMono.variable} antialiased`}>
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
