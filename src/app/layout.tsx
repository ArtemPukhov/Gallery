import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Передвижники — галерея",
  description:
    "Галерея работ художников-передвижников: подборка произведений, описания и персональные страницы."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={cormorant.className}>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">{children}</main>
      </body>
    </html>
  );
}
