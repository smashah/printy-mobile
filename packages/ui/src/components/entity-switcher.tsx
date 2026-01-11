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
 * Generic entity switcher component that can be used for organizations, brands, projects, etc.
 * Provides a dropdown menu with the ability to switch between entities or create new ones.
 */
export interface EntitySwitcherProps<T = any> {
  /** Array of entities to display in the switcher */
  entities: {
    id: string;
    name: string;
    logo: React.ElementType;
    description?: string;
    /** Additional metadata for the entity (e.g., plan, status, etc.) */
    metadata?: T;
  }[];
  /** ID of the currently selected entity */
  selectedEntityId?: string | null;
  /** Callback when an entity is selected or "create" is triggered */
  onEntityChange?: (entityId: string | "create") => void;
  /** Label for the entity type (e.g., "Organizations", "Brands", "Projects") */
  entityLabel: string;
  /** Singular label for creating new entity (e.g., "organization", "brand", "project") */
  createLabel: string;
  /** Show create option in the dropdown */
  showCreate?: boolean;
  /** Custom renderer for entity metadata in the trigger button */
  renderMetadata?: (entity: EntitySwitcherProps["entities"][0]) => React.ReactNode;
}

export function EntitySwitcher({
  entities,
  selectedEntityId,
  onEntityChange,
  entityLabel,
  createLabel,
  showCreate = true,
  renderMetadata,
}: EntitySwitcherProps) {
  const { isMobile } = useSidebar();

  // Find the active entity based on selectedEntityId, or default to first entity
  const activeEntity = React.useMemo(() => {
    if (selectedEntityId) {
      const found = entities.find((entity) => entity.id === selectedEntityId);
      if (found) return found;
    }
    return entities[0];
  }, [entities, selectedEntityId]);

  const defaultMetadataRenderer = (entity: EntitySwitcherProps["entities"][0]) => {
    if (entity.description) {
      return <span className="truncate text-xs">{entity.description}</span>;
    }
    if (entity.metadata && typeof entity.metadata === 'object' && 'plan' in entity.metadata) {
      return <span className="truncate text-xs">{(entity.metadata as any).plan}</span>;
    }
    return null;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                !activeEntity && "data-[state=open]:border"
              )}
            >
              {activeEntity ? (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeEntity.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeEntity.name}
                    </span>
                    {renderMetadata ? renderMetadata(activeEntity) : defaultMetadataRenderer(activeEntity)}
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              ) : showCreate ? (
                <div className="flex flex-row items-center justify-center">
                  <div
                    className="gap-2 p-2 flex flex-row items-center justify-center"
                    onClick={() => onEntityChange?.("create")}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add {createLabel}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 text-left text-sm leading-tight">
                  <span className="text-muted-foreground">No {entityLabel.toLowerCase()}</span>
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
              {entityLabel}
            </DropdownMenuLabel>
            {entities.map((entity, index) => (
              <DropdownMenuItem
                key={entity.id}
                onClick={() => onEntityChange?.(entity.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <entity.logo className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{entity.name}</span>
                  {entity.description && (
                    <span className="text-xs text-muted-foreground">
                      {entity.description}
                    </span>
                  )}
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {showCreate && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => onEntityChange?.("create")}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add {createLabel}
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// Convenience exports for common use cases
export const OrgSwitcher = (props: Omit<EntitySwitcherProps, 'entityLabel' | 'createLabel'>) => (
  <EntitySwitcher {...props} entityLabel="Organizations" createLabel="organization" />
);

export const BrandSwitcher = (props: Omit<EntitySwitcherProps, 'entityLabel' | 'createLabel'>) => (
  <EntitySwitcher {...props} entityLabel="Brands" createLabel="brand" />
);

export const ProjectSwitcher = (props: Omit<EntitySwitcherProps, 'entityLabel' | 'createLabel'>) => (
  <EntitySwitcher {...props} entityLabel="Projects" createLabel="project" />
);

export const TeamSwitcher = (props: Omit<EntitySwitcherProps, 'entityLabel' | 'createLabel'>) => (
  <EntitySwitcher {...props} entityLabel="Teams" createLabel="team" />
);