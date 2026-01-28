import { ThemeProvider } from "next-themes";
import { Geist, Inter, Public_Sans } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "../components/ui/sonner";
import QueryProvider from "./query-provider";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "700"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["400", "700"],
});

export type Props = {
  children: ReactNode;
};

export default async function LocaleLayout({ children }: Props) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${publicSans.className} ${inter.variable} ${geist.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <Toaster />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
