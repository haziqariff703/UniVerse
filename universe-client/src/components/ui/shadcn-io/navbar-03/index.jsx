"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

// Simple logo component for the navbar
const Logo = (props) => {
  return (
    <svg
      aria-label="Logo"
      role="img"
      fill="currentColor"
      height="1em"
      viewBox="0 0 324 323"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        fill="currentColor"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 88.1023 144.792)"
        width="151.802"
        x="88.1023"
        y="144.792"
      />
      <rect
        fill="currentColor"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 85.3459 244.537)"
        width="151.802"
        x="85.3459"
        y="244.537"
      />
    </svg>
  );
};

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }) => (
  <svg
    aria-label="Menu"
    role="img"
    className={cn("pointer-events-none", className)}
    fill="none"
    height={16}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={16}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-spring group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
      d="M4 12L20 12"
    />
    <path
      className="origin-center transition-all duration-300 ease-spring-extra group-aria-expanded:rotate-45"
      d="M4 12H20"
    />
    <path
      className="origin-center translate-y-[7px] transition-all duration-300 ease-spring group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
      d="M4 12H20"
    />
  </svg>
);

// Default navigation links
const defaultNavigationLinks = [
  { href: "#", label: "Home", active: true },
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "About" },
];

export const Navbar03 = React.forwardRef(
  (
    {
      className,
      logo = <Logo />,
      logoHref = "#",
      navigationLinks = defaultNavigationLinks,
      signInText = "Sign In",

      ctaText = "Get Started",
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref,
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback(
      (node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );
    return (
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline",
          className,
        )}
        ref={combinedRef}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    size="icon"
                    variant="ghost"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem className="w-full" key={index}>
                          <button
                            type="button"
                            className={cn(
                              "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline",
                              link.active && "bg-accent text-accent-foreground",
                            )}
                            onClick={(e) => e.preventDefault()}
                          >
                            {link.label}
                          </button>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <a
                href={logoHref}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="text-2xl">{logo}</div>
                <span className="hidden font-bold text-xl sm:inline-block">
                  shadcn.io
                </span>
              </a>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          className={cn(
                            "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer relative",
                            "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100",
                            link.active && "before:scale-x-100 text-primary",
                          )}
                          data-active={link.active}
                          href={link.href}
                          onClick={(e) => e.preventDefault()}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              className="text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={(e) => {
                e.preventDefault();
                if (onSignInClick) {
                  onSignInClick();
                }
              }}
              size="sm"
              variant="ghost"
            >
              {signInText}
            </Button>
            <Button
              className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                if (onCtaClick) {
                  onCtaClick();
                }
              }}
              size="sm"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </header>
    );
  },
);

Navbar03.displayName = "Navbar03";

export { Logo, HamburgerIcon };
