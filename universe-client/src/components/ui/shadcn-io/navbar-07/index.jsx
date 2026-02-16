import { BellIcon, ChevronDownIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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

// Notification Menu Component
const NotificationMenu = ({ notificationCount = 3, onItemClick }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="h-9 w-9 relative" size="icon" variant="ghost">
        <BellIcon className="h-4 w-4" />
        {notificationCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {notificationCount > 9 ? "9+" : notificationCount}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-80">
      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("notification1")}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">New message received</p>
          <p className="text-xs text-muted-foreground">2 minutes ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("notification2")}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">System update available</p>
          <p className="text-xs text-muted-foreground">1 hour ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("notification3")}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Weekly report ready</p>
          <p className="text-xs text-muted-foreground">3 hours ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("view-all")}>
        View all notifications
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// User Menu Component
const UserMenu = ({
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar,
  onItemClick,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground"
        variant="ghost"
      >
        <Avatar className="h-7 w-7">
          <AvatarImage alt={userName} src={userAvatar} />
          <AvatarFallback className="text-xs">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <ChevronDownIcon className="h-3 w-3 ml-1" />
        <span className="sr-only">User menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {userEmail}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("profile")}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("settings")}>
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("billing")}>
        Billing
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("logout")}>
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Default breadcrumb items
const defaultBreadcrumbItems = [
  { href: "#", label: "Personal Account" },
  { href: "#", label: "Projects" },
];

// Default projects
const defaultProjects = [
  { value: "1", label: "Main project" },
  { value: "2", label: "Origin project" },
];

export const Navbar07 = React.forwardRef(
  (
    {
      className,
      logo = <Logo />,
      logoHref = "#",
      breadcrumbItems = defaultBreadcrumbItems,
      projects = defaultProjects,
      defaultProject = "1",
      userName = "John Doe",
      userEmail = "john@example.com",
      userAvatar,
      notifications = [], // repurposed from notificationCount for flexibility
      onNotificationClick,
      tabs = [], // [{ id, label, icon }]
      activeTab,
      onTabChange,
      onSignOut,
      ...props
    },
    ref,
  ) => {
    return (
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6",
          className,
        )}
        ref={ref}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side: Logo + Navigation */}
          <div className="flex items-center gap-6">
            <a
              href={logoHref}
              className="flex items-center gap-2 text-foreground font-bold text-lg"
            >
              {logo}
            </a>

            {/* Tabs Navigation (Replaces Breadcrumbs if tabs exist) */}
            {tabs.length > 0 ? (
              <nav className="hidden md:flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    {tab.icon && <tab.icon className="w-4 h-4" />}
                    {tab.label}
                  </button>
                ))}
              </nav>
            ) : (
              <Breadcrumb>
                <BreadcrumbList>
                  {/* ... existing breadcrumb logic ... */}
                  {breadcrumbItems.map((item, index) => (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                      {index < breadcrumbItems.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu for Tabs (if tabs exist) */}
            {tabs.length > 0 && (
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDownIcon className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {tabs.map((tab) => (
                      <DropdownMenuItem
                        key={tab.id}
                        onClick={() => onTabChange?.(tab.id)}
                      >
                        {tab.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onSignOut}
                      className="text-red-500"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Notification and UserMenu are disabled for now since props were refactored */}

            {/* Explicit Sign Out Button (Desktop) */}
            {onSignOut && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={onSignOut}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  },
);

Navbar07.displayName = "Navbar07";

export { Logo, NotificationMenu, UserMenu };
