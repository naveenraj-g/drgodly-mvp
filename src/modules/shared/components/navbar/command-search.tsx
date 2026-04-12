"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@/i18n/navigation";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const appsList = [
  {
    name: "Admin",
    logo: "/app-icons/admin.svg",
    admin: "/bezs/admin",
  },
  {
    name: "File Nest",
    logo: "/app-icons/file-nest.svg",
    patient: "/bezs/filenest",
    doctor: "/bezs/filenest",
    ["application-admin"]: "/bezs/filenest/admin",
  },
  {
    name: "Tele Medicine",
    logo: "/app-icons/tele-medicine.svg",
    patient: "/bezs/telemedicine/patient/appointments/intake",
    doctor: "/bezs/telemedicine/doctor",
    ["application-admin"]: "/bezs/telemedicine/admin",
  },
  {
    name: "AI Hub",
    logo: "/app-icons/aihub.svg",
    patient: "/bezs/aihub/chat",
    doctor: "/bezs/aihub/chat",
    ["application-admin"]: "/bezs/aihub/admin",
  },
];

type TUser = {
  name: string;
  email: string;
  image?: string | null;
  username?: string | null;
  currentOrgId?: string | null;
  role?: string | null;
};

interface ICommandSearchProps {
  user: TUser;
}

export function CommandSearch({ user }: ICommandSearchProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const role = user.role;

  return (
    <>
      <Button
        variant="outline"
        className={
          "bg-muted/25 group text-muted-foreground hover:bg-accent relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64 flex items-center"
        }
        onClick={() => setOpen(true)}
      >
        <SearchIcon
          aria-hidden="true"
          className="absolute start-1.5 top-1/2 -translate-y-1/2"
          size={16}
        />
        <span className="ms-4">Search</span>
        <kbd className="bg-muted group-hover:bg-accent pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog modal open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <ScrollArea type="hover" className="h-72 pe-1">
            <CommandEmpty>No results found.</CommandEmpty>
            {role ? (
              <CommandGroup heading="Apps">
                <div>
                  {appsList.map((app) => {
                    const h = app[role as keyof typeof app];

                    if (!h) return null;

                    return (
                      <CommandItem asChild key={app.name}>
                        <Link href={h} onClick={() => setOpen(false)}>
                          <Image
                            src={app.logo}
                            alt={app.name}
                            width={20}
                            height={20}
                          />
                          <p>{app.name}</p>
                        </Link>
                      </CommandItem>
                    );
                  })}
                </div>
              </CommandGroup>
            ) : (
              <CommandGroup heading="Apps">
                <CommandItem disabled>
                  <span className="text-muted-foreground text-sm">
                    No apps available for your role
                  </span>
                </CommandItem>
              </CommandGroup>
            )}
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  );
}
