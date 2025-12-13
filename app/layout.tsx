import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";



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
        {children}
      </body>
    </html>
  );
}