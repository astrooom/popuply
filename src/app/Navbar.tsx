"use client";

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky top-0 z-40">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="h-14 px-4 w-screen flex justify-between">
          <NavigationMenuItem className="font-bold flex">
            <Link
              rel="noreferrer noopener"
              href="/"
              className="font-bold text-xl flex items-center gap-x-2"
            >
              <Image src="/logo/logo.png" alt="logo" width={48} height={48} />
              <span>Popuply</span>
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            {/* <ModeToggle /> */}
            <ThemeToggle />
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">

                <div className="flex md:hidden" onClick={() => setIsOpen(true)}>
                  <span className="sr-only">Menu Icon</span>
                  <Menu className="h-5 w-5" />
                </div>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Popuply
                  </SheetTitle>
                </SheetHeader>

              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}


          <div className="hidden md:flex gap-2">

            <Link href="/login" className={`border ${buttonVariants({ variant: "secondary" })}`}>
              Get Started
            </Link>

            {/* <ModeToggle /> */}
            <ThemeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
