import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  other: {
    "darkreader-lock": "",
  },
  title: "Monash Association of Coding",
  description: "At MAC, we aim to impart technical skills and industry-relevant experiences to students to bridge the gap between the classroom and industry. We want to make coding a fun experience for all—regardless of degree, year level, and experience—by providing collaborative learning opportunities for our members.",
  openGraph: {
    title: "Monash Association of Coding",
    description: "At MAC, we aim to impart technical skills and industry-relevant experiences to students to bridge the gap between the classroom and industry.",
    images: [{ url: "/logo/logo.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monash Association of Coding",
    description: "At MAC, we aim to impart technical skills and industry-relevant experiences to students to bridge the gap between the classroom and industry.",
    images: ["/logo/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.variable} antialiased m-0 p-0`}>
        {children}
      </body>
    </html>
  );
}
