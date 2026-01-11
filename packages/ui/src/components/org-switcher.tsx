"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@printy-mobile/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@printy-mobile/ui/components/sidebar";
import { cn } from "../lib/utils";

export function OrgSwitcher({
  orgs,
  selectedOrgId,
  onOrgChange,
}: {
  orgs: {
    id: string;
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  selectedOrgId?: string | null;
  onOrgChange?: (orgId: string | "create") => void;
}) {
  const { isMobile } = useSidebar();

  // Find the active team based on selectedTeamId, or default to first team
  const activeOrg = React.useMemo(() => {
    if (selectedOrgId) {
      const found = orgs.find((org) => org.id === selectedOrgId);
      if (found) return found;
    }
    return orgs[0];
  }, [orgs, selectedOrgId]);

  if (!activeOrg) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                !activeOrg && "data-[state=open]:border"
              )}
            >
              {activeOrg ? (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeOrg.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeOrg.name}
                    </span>
                    <span className="truncate text-xs">{activeOrg.plan}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              ) : (
                <>
                  <div
                    className="gap-2 p-2"
                    onClick={() => onOrgChange?.("create")}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add Organization
                    </div>
                  </div>
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {orgs.map((org, index) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => onOrgChange?.(org.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <org.logo className="size-4 shrink-0" />
                </div>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => onOrgChange?.("create")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
