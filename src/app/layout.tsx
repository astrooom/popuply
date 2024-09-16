import { Itim, League_Spartan } from "next/font/google"
import { cn } from "@/utils/cn"
import "@/app/style.css"

import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/Sonner"
import { Footer } from "./Footer"
import { ScriptLoader } from "./ScriptLoader"
import { Suspense } from "react"

const ItimFont = Itim({
  subsets: ["latin"],
  variable: "--font-itim",
  weight: "400",
})

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-leaguespartan",
  weight: "400",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(ItimFont.variable, leagueSpartan.variable, "font-itim")}>
      <body className={"min-h-screen bg-background antialiased"}>
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

        <Suspense>
          <ScriptLoader />
        </Suspense>
      </body>
    </html>
  )
}
