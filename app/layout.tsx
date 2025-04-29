import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Footer from "@/components/footer";
import { createClient } from "@/utils/supabase/server";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "A ch'camion",
  description: "Une carte de fidélité pour votre cam'tar preféré",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const LEO = "ca5ff451-ab18-4bb1-a13e-e2d7c11c948b";
const WINNIE = "07b67636-8477-4e74-8421-6b426e7c5e79";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>A Ch'camion</Link>
                    {(user?.id === LEO || user?.id === WINNIE) && (
                      <Link href={"/admin"}>Admin</Link>
                    )}
                    <div className="flex items-center gap-2"></div>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <div className="w-full max-w-[900px]">
                <div className="">{children}</div>
              </div>
              <Footer />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
