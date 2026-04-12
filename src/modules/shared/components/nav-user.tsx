"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/modules/client/auth/betterauth/auth-client";
import { ThemeSwitcher } from "@/theme/theme-switcher";
import {
  Check,
  ChevronRight,
  ChevronsUpDown,
  Globe,
  LogOut,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";

type TUser = {
  name: string;
  email: string;
  image: string | null | undefined;
  username: string | null | undefined;
  activeOrganizationId: string | null | undefined;
};

export function NavUser({
  isSidebar = false,
  user,
}: {
  user: TUser;
  isSidebar?: boolean;
}) {
  const router = useRouter();
  const { name, email, image, username } = user;
  const { state } = useSidebar();

  async function handleLogout() {
    const { data, error } = await authClient.signOut();

    if (!data?.success || !data) {
      toast.error("Something went wrong!", {
        description: error?.message,
        richColors: true,
      });
      return;
    }

    if (data.success) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isSidebar ? (
          <SidebarMenuButton
            size="lg"
            className={cn(
              state === "expanded" &&
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
              "cursor-pointer",
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={image || "https://github.com/shadcn.png"} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
            <ChevronsUpDown className="ms-auto size-4" />
          </SidebarMenuButton>
        ) : (
          <Avatar className="cursor-pointer">
            <AvatarImage src={image || "https://github.com/shadcn.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" sideOffset={10} asChild>
        <div>
          <DropdownMenuLabel className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={image || "https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p>
                {name} (@{username || "no username"})
              </p>
              <p>{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* First element */}
          <DropdownMenuItem className="p-0 cursor-pointer w-full">
            <ThemeSwitcher isAppNav />
          </DropdownMenuItem>

          {/* Second element */}
          <DropdownMenuItem className="cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Globe className="!h-[1.1rem] !w-[1.1rem] dark:text-white" />
                  <p>Change language</p>
                </div>
                <ChevronRight className="!h-[1.2rem] !w-[1.2rem] dark:text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="left"
                sideOffset={18}
                className="space-y-1"
              >
                <div
                  className="flex items-center justify-between px-1.5 py-1 cursor-pointer hover:bg-secondary"
                  onClick={() => {}}
                >
                  EN
                  <Check className="!h-[1.2rem] !w-[1.2rem]" />
                </div>

                <div
                  className="px-1 py-0.5 cursor-pointer hover:bg-secondary"
                  onClick={() => {}}
                >
                  HI
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuItem>

          {/* Third element */}
          <DropdownMenuItem
            className="cursor-pointer"
            // onClick={() => router.push("/bezs/settings")}
          >
            <Link
              href="/bezs/dashboard/settings/account"
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              <Settings2 className="!h-[1.2rem] !w-[1.2rem] dark:text-white block" />
              <p>Settings</p>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Fourth element */}
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogout}
            onMouseEnter={() => router.prefetch("/")}
          >
            <LogOut className="!h-[1.2rem] !w-[1.2rem] dark:text-white" />
            <p>Logout</p>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
