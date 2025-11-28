import Header from "@/components/Header";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextBlog – Protected Full-Stack App",
  description: "Next.js 16 + NextAuth v5 + MongoDB + Server Actions",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch session on server (passes to client wrapper)
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProviderWrapper session={session}>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
