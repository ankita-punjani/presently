import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Presently 🎀",
  description: "The right present, right on time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${dmSans.variable} font-sans antialiased`}>
        <NavBar />
        <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
