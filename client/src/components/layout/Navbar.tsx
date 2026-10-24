"use client";

import { Menu } from "lucide-react";
import { cn } from "cn";
import Link from "next/link";


import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;

  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };

  menu?: MenuItem[];

  auth?: {
    login: {
      title: string;
      url: string;
    };

    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Imtiaz Blog",
  },

  menu = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Blogs",
      url: "/blogs",
    },
    {
      title: "About",
      url: "/about",
    },
    {
      title: "Dashboard",
      url: "/dashboard",
    },
  ],

  auth = {
    login: {
      title: "Login",
      url: "/login",
    },

    signup: {
      title: "Sign up",
      url: "/register",
    },
  },

  className,
}: Navbar1Props) => {
  return (
    <section className={cn("py-4", className)}>
      <div className="container mx-auto px-2">
        {/* ================= DESKTOP NAVBAR ================= */}
        <nav className="hidden items-center justify-between lg:flex">
          {/* Logo + Menu */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link
              href={logo.url}
              className="flex items-center gap-2"
            >
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />

              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-2">
            <ModeToggle/>
            <Button
              variant="outline"
              size="sm"
              render={
                <Link href={auth.login.url}>
                  {auth.login.title}
                </Link>
              }
              nativeButton={false}
            >
              {auth.login.title}
            </Button>

            <Button
              size="sm"
              render={
                <Link href={auth.signup.url}>
                  {auth.signup.title}
                </Link>
              }
              nativeButton={false}
            >
              {auth.signup.title}
            </Button>
          </div>
        </nav>

        {/* ================= MOBILE NAVBAR ================= */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <Link
              href={logo.url}
              className="flex items-center gap-2"
            >
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />

              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                  />
                }
              >
                <Menu className="size-4" />
              </SheetTrigger>

              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={logo.url}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={logo.src}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                      />

                      <span className="text-lg font-semibold tracking-tighter">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 p-4">
                  {/* Mobile Menu Items */}
                  <div className="flex flex-col gap-4">
                    {menu.map((item) =>
                      renderMobileMenuItem(item)
                    )}
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col gap-3">
                     <ModeToggle/>
                    <Button
                      variant="outline"
                      render={
                        <Link href={auth.login.url}>
                          {auth.login.title}
                        </Link>
                      }
                      nativeButton={false}
                    >
                      {auth.login.title}
                    </Button>

                    <Button
                      render={
                        <Link href={auth.signup.url}>
                          {auth.signup.title}
                        </Link>
                      }
                      nativeButton={false}
                    >
                      {auth.signup.title}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   DESKTOP MENU ITEM
   ========================================================= */

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        render={<Link href={item.url}>{item.title}</Link>}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      />
    </NavigationMenuItem>
  );
};
/* =========================================================
   MOBILE MENU ITEM
   ========================================================= */

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <Link
      key={item.title}
      href={item.url}
      className="text-md font-semibold"
    >
      {item.title}
    </Link>
  );
};

export { Navbar };