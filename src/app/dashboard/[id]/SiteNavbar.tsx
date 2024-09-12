import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/NavigationMenu"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ArrowLeft } from "lucide-react"

export const SiteNavbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full ">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem>
            <Link href="/dashboard" className={`border ${buttonVariants({ variant: "ghost" })}`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Link>
          </NavigationMenuItem>

          <div className="hidden md:flex gap-2">
            <Link href="/logout" className={`border ${buttonVariants({ variant: "destructive" })}`}>
              Log Out
            </Link>

            <ThemeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
