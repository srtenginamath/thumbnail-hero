import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "ThumbnailHero - AI-Powered YouTube Thumbnail Generator",
  description:
    "Create click-worthy YouTube thumbnails in seconds with AI. Transform your ideas into professional thumbnails optimized for both YouTube videos and Shorts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`font-sans ${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <Suspense fallback={null}>{children}</Suspense>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
