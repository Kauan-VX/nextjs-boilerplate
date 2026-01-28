import type { Metadata } from "next";
import "./globals.css";
import LocaleLayout from "./providers/providers";

export const metadata: Metadata = {
  title: "Wemei",
  description: "Controle total da sua MEI de serviço",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LocaleLayout>{children}</LocaleLayout>;
}
