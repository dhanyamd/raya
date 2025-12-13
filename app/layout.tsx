import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { HotkeysProviders } from "@/components/hot-key-provider";

const poppins = Manrope({
  subsets:["latin"],
  weight: ["200", "300", "400", "500", "600", "700" , "800"],
})

export const metadata: Metadata = {
  title: "PostBoy",
  description: "A modern API client for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
            <HotkeysProviders>
              <Toaster />
              {children}
            </HotkeysProviders>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}