"use client";

// components/navigation/nav-menu.tsx
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// ListItem component for navigation dropdowns
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function MainNavigationMenu() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Left side: Logo and Navigation Menu */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-black dark:text-white"
          >
            Co-oder
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/projects"
                  className={navigationMenuTriggerStyle()}
                >
                  All projects
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features Projects</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <ListItem
                      href="/features/active-projects"
                      title="Active Projects"
                    >
                      Projects actively looking for collaborators.
                    </ListItem>
                    <ListItem
                      href="/features/done-projects"
                      title="Completed Projects"
                    >
                      Projects that have been completed.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth Buttons - pushed to the right */}
        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              {/* Logged in state */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      {/* Optional: Add user avatar here */}
                      <span className="text-sm">{user.username}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4">
                        <ListItem href={`/users/${user.id}`} title="Dashboard">
                          View your dashboard
                        </ListItem>
                        <ListItem href="/settings" title="Settings">
                          Manage your account
                        </ListItem>
                        <li>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={logout}
                          >
                            Sign Out
                          </Button>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </>
          ) : (
            <>
              {/* Logged out state */}
              <Button variant="outline" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
