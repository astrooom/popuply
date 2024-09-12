import type { Metadata } from "next"
import { Short_Stack, Itim } from "next/font/google"
import { cn } from "@/utils/cn"
import "@/app/style.css"

import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/Sonner"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", ItimFont.variable, shortStack.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
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
