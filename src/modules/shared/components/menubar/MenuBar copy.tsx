"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "../nav-user";
import { OrgSwitcher } from "./org-switcher";
import { type NavGroup as NavGroupProps } from "./types";
import { homeSidebarData } from "./menu-datas";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type TUser = {
  name: string;
  email: string;
  image: string | null | undefined;
  username: string | null | undefined;
  activeOrganizationId: string | null | undefined;
};

// ------------------------------------------------------------------ //
// API types (from /api/me/context)
// ------------------------------------------------------------------ //
interface NavNode {
  id: string;
  label: string;
  slug: string;
  icon: string | null;
  href: string | null;
  type: string;
  isVisible: boolean;
  permissionKeys: string[];
  children: NavNode[];
}

interface ContextApp {
  id: string;
  name: string;
  slug: string;
  menus: NavNode[];
}

interface ContextOrg {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

interface ContextResponse {
  apps: ContextApp[];
  permissions: string[];
  organizations: ContextOrg[];
  activeOrganizationId: string | null;
}

// ------------------------------------------------------------------ //
// Convert API response → NavGroup[] that NavGroup component expects
// ------------------------------------------------------------------ //
function buildNavGroups(apps: ContextApp[]): NavGroupProps[] {
  return apps.flatMap((app) =>
    app.menus
      .filter((node) => node.type === "GROUP" && node.isVisible)
      .map((group) => ({
        title: group.label,
        items: group.children
          .filter((child) => child.type === "ITEM" && child.isVisible)
          .map((child) => {
            const visibleSubs = child.children.filter((sub) => sub.isVisible);
            if (visibleSubs.length > 0) {
              return {
                title: child.label,
                icon: child.icon ?? undefined,
                items: visibleSubs.map((sub) => ({
                  title: sub.label,
                  url: sub.href ?? "#",
                  icon: sub.icon ?? undefined,
                })),
              };
            }
            return {
              title: child.label,
              url: child.href ?? "#",
              icon: child.icon ?? undefined,
            };
          }),
      })),
  );
}

const SKELETON_GROUPS = [3, 2, 2, 1, 4, 3];

function NavSkeleton() {
  return (
    <>
      {SKELETON_GROUPS.map((count, gi) => (
        <SidebarGroup key={gi}>
          <SidebarGroupLabel>
            <Skeleton className="h-3 w-full bg-muted-foreground/25" />
          </SidebarGroupLabel>
          <SidebarMenu>
            {Array.from({ length: count }).map((_, ii) => (
              <SidebarMenuItem key={ii}>
                <SidebarMenuButton>
                  <Skeleton className="h-4 w-4 shrink-0 rounded bg-muted-foreground/25" />
                  <Skeleton className="h-4 flex-1 bg-muted-foreground/25" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

export function MenuBar(user: TUser) {
  const [allApps, setAllApps] = useState<ContextApp[]>([]);
  const [organizations, setOrganizations] = useState<ContextOrg[]>([]);
  const [activeOrganizationId, setActiveOrganizationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Derive the current app slug from the first path segment.
  // e.g. "bezs/telemedicine/profile" → "telemedicine"
  const segments = pathname.split("/").filter(Boolean);
  const currentAppSlug = segments[1] ?? "";

  const isHome = segments.length <= 1 || currentAppSlug === "";

  const currentApp = allApps?.find((a) => a.slug === currentAppSlug);
  const navGroups: NavGroupProps[] = isHome
    ? (homeSidebarData.navGroups as NavGroupProps[])
    : currentApp
      ? buildNavGroups([currentApp])
      : [];

  const fetchContext = useCallback((orgId?: string | null) => {
    const url = orgId
      ? `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/me/context?organizationId=${orgId}`
      : `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/me/context`;

    return fetch(url, { credentials: "include" })
      .then((res) => res.json() as Promise<ContextResponse>)
      .then((data) => {
        console.log(data);
        setAllApps(data.apps ?? []);
        setOrganizations(data.organizations ?? []);
        setActiveOrganizationId(data.activeOrganizationId ?? null);
      })
      .catch(() => {
        setAllApps([]);
        setOrganizations([]);
        setActiveOrganizationId(null);
        // silently keep empty — auth guards handle access
      });
  }, []);

  useEffect(() => {
    fetchContext(user.activeOrganizationId).finally(() => setIsLoading(false));
  }, [fetchContext, user.activeOrganizationId]);

  function handleOrgSwitch(orgId: string) {
    setActiveOrganizationId(orgId);
    fetchContext(orgId);
  }

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader>
        {organizations.length > 0 || !organizations ? (
          <OrgSwitcher
            orgs={organizations}
            activeOrganizationId={activeOrganizationId}
            onSwitch={handleOrgSwitch}
          />
        ) : null}
      </SidebarHeader>
      <SidebarContent>
        {!isHome && isLoading ? (
          <NavSkeleton />
        ) : (
          navGroups.map((props) => <NavGroup key={props.title} {...props} />)
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isSidebar />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
