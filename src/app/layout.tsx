import type { Metadata } from "next"
import { Short_Stack, Itim, Playpen_Sans, Chilanka } from "next/font/google"

import { cn } from "@/utils/cn"

import "@/app/style.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import Image from "next/image"
import { Toaster } from "@/components/ui/Sonner"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

const shortStack = Short_Stack({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
})

const ItimFont = Itim({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
})

export const metadata: Metadata = {
  title: "Next Auth Postgres Starter",
  description: "An example of how to use NextJS with Auth.js and a PostgreSQL database",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", ItimFont.variable, shortStack.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* <AuthProvider> */}

          <div className="fixed inset-0 grainy-light dark:grainy-dark pointer-events-none"></div>

          <main className="relative">
            {children}
            <Footer />
          </main>

          <Toaster />

          {/* </AuthProvider> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
