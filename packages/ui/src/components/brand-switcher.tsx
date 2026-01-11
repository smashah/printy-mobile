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
} from "./dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./sidebar";
import { cn } from "../lib/utils";

/**
 * Brand switcher component for switching between different brands
 * within an organization or application context.
 */
export function BrandSwitcher({
  brands,
  selectedBrandId,
  onBrandChange,
}: {
  brands: {
    id: string;
    name: string;
    logo: React.ElementType;
    description?: string;
  }[];
  selectedBrandId?: string | null;
  onBrandChange?: (brandId: string | "create") => void;
}) {
  const { isMobile } = useSidebar();

  // Find the active brand based on selectedBrandId, or default to first brand
  const activeBrand = React.useMemo(() => {
    if (selectedBrandId) {
      const found = brands.find((brand) => brand.id === selectedBrandId);
      if (found) return found;
    }
    return brands[0];
  }, [brands, selectedBrandId]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                !activeBrand && "data-[state=open]:border"
              )}
            >
              {activeBrand ? (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeBrand.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeBrand.name}
                    </span>
                    <span className="truncate text-xs">
                      {activeBrand.description}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              ) : (
                <div className="flex flex-row items-center justify-center">
                  <div
                    className="gap-2 p-2 flex flex-row items-center justify-center"
                    onClick={() => onBrandChange?.("create")}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add Brand
                    </div>
                  </div>
                </div>
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
              Brands
            </DropdownMenuLabel>
            {brands.map((brand, index) => (
              <DropdownMenuItem
                key={brand.id}
                onClick={() => onBrandChange?.(brand.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <brand.logo className="size-4 shrink-0" />
                </div>
                {brand.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => onBrandChange?.("create")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add brand</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}