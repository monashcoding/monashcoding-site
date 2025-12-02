import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mac Homepage",
  description: "A Next.js project with Spline and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
