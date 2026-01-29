import type { Metadata } from "next";
import "./globals.css";
import LocaleLayout from "./providers/providers";

export const metadata: Metadata = {
  title: "NextJs Boilerplate",
  description:
    "Boilerplate moderno com Next.js, React, TypeScript e TailwindCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LocaleLayout>{children}</LocaleLayout>;
}
