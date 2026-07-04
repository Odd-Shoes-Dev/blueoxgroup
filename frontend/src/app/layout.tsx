import type { Metadata } from "next";
import { Bebas_Neue, Inter, Space_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blue Ox Group",
  description:
    "Blue Ox Group — a group of software companies. Directory of sales and marketing representatives.",
  openGraph: {
    title: "Blue Ox Group",
    description:
      "Blue Ox Group — a group of software companies. Directory of sales and marketing representatives.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Blue Ox Group" }],
  },
  twitter: {
    card: "summary",
    title: "Blue Ox Group",
    description:
      "Blue Ox Group — a group of software companies. Directory of sales and marketing representatives.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
