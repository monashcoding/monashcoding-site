import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Monash Association of Coding",
  description: "At MAC, we aim to impart technical skills and industry-relevant experiences to students to bridge the gap between the classroom and industry. We want to make coding a fun experience for all—regardless of degree, year level, and experience—by providing collaborative learning opportunities for our members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${outfit.variable} antialiased m-0 p-0`}>
        {children}
      </body>
    </html>
  );
}
