import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ClickSpark from "@/components/ClickSpark";

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
        <ClickSpark
          sparkColor="#1a1a1a"
          sparkSize={10}
          sparkRadius={30}
          sparkCount={8}
          duration={400}
          easing="ease-out"
          extraScale={1.5}
        >
          <Navigation />
          {children}
        </ClickSpark>
      </body>
    </html>
  );
}
