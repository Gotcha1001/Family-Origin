"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  FilePlus2,
  FileText,
  Settings,
  LayoutDashboard,
  Home,
  Search,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// /dashboard/create and /dashboard/cvs are built in Phase 2 — the links are
// wired up now so the shell is complete, they just don't have pages yet.
const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/search", label: "Search a surname", icon: Search },
  { href: "/dashboard/history", label: "My Searches", icon: Clock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <Sidebar className="dark:bg-[#0d0620] dark:border-[#8b5cf6]/10">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-3">
          <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-amber-500 dark:bg-[#8b5cf6]">
            <span className="absolute inset-0 rounded-full bg-[#8b5cf6] opacity-0 dark:opacity-60 dark:animate-ping" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#12213A] dark:text-[#F5F3FF]">
              Family{" "}
              <span className="text-amber-600 dark:text-[#a78bfa]">Roots</span>
            </p>
            <p className="text-[10px] text-muted-foreground dark:text-[#ede9fe]/50">
              Trace where your name comes from
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="dark:text-[#c4b5fd]/60">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="dark:text-[#ede9fe]/70 dark:hover:bg-[#4338ca]/15 dark:hover:text-[#f5f3ff] data-[active=true]:dark:bg-[#4338ca]/20 data-[active=true]:dark:text-[#f5f3ff] data-[active=true]:dark:border-l-2 data-[active=true]:dark:border-[#8b5cf6]"
                  >
                    <Link href={href} className="flex items-center gap-2">
                      <Icon
                        size={16}
                        className={isActive ? "dark:text-[#c4b5fd]" : ""}
                      />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <div className="px-3 py-2 border-t border-amber-900/10 dark:border-[#8b5cf6]/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 dark:bg-[#4338ca]/25 flex items-center justify-center text-xs font-medium text-amber-700 dark:text-[#c4b5fd]">
                {(user.fullName ?? user.username ?? "U").slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-[#12213A] dark:text-[#F5F3FF]">
                  {user.fullName ?? user.username}
                </p>
                <p className="text-[10px] text-muted-foreground truncate dark:text-[#ede9fe]/45">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
