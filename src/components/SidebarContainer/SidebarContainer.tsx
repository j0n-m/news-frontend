import { ReactNode, useState } from "react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  Sidebar,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from "../ui/sidebar";
import {
  HomeIcon,
  PlusIcon,
  RssIcon,
  UserIcon,
  FileQuestionIcon,
  SearchIcon,
  SettingsIcon,
  MailQuestion,
  LogOutIcon,
  ChevronsUpDownIcon,
  LucideProps,
  UserCircleIcon,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Link, useLocation } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import fetch from "@/utils/fetch";
import useAuth from "@/hooks/useAuth";

type SidebarContainerProps = {
  children?: ReactNode;
};
type NavItem = {
  variant?: "outline" | "default";
  id: number;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  iconClassName: string;
  link: string;
  linkName: string;
};
const navItems: NavItem[] = [
  {
    id: 0,
    label: "Home",
    icon: HomeIcon,
    iconClassName: "size-6",
    link: "/",
    linkName: "",
  },
  {
    id: 1,
    label: "Search in feed",
    icon: SearchIcon,
    iconClassName: "size-6",
    linkName: "search-in-feed",
    link: "/",
  },
  {
    id: 2,
    label: "Add new feed",
    icon: PlusIcon,
    iconClassName: "size-6",
    linkName: "",
    variant: "outline",
    link: "/create/feeds",
  },
];
const navFeeds = [];

function SidebarContainer({ children }: SidebarContainerProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  // console.log('sidebar queryname',queryName);
  // const myFeedsQuery = useQuery({
  //   queryKey: ["myFeeds"],
  //   queryFn: async () => await fetch.get(`/api/feed/${}`, { withCredentials: true }),
  // });
  console.log("sidebar pathname", location.pathname);

  return (
    <div className="content flex flex-col min-h-screen">
      <SidebarProvider className="group">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-lg" asChild>
                  <a href="/">
                    <RssIcon className="size-10" strokeWidth={3}></RssIcon>
                    <span className="font-bold">News RSS</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        variant={item?.variant || "default"}
                        isActive={item.link === location.pathname}
                        asChild
                      >
                        <Link
                          to={item.link}
                          // search={{ n: item.linkName }}
                          // mask={{ to: `${item.linkName}` }}
                        >
                          <item.icon className={item.iconClassName}></item.icon>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>My Feeds</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navFeeds.map((feed, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton>
                        <span>something</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {navFeeds.length < 1 && (
                    <p className="px-2 italic group-data-[state=collapsed]:hidden">
                      You have no feeds
                    </p>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-2">
                          <UserCircleIcon
                            className="size-8"
                            strokeWidth={1.25}
                          ></UserCircleIcon>
                          <span>User</span>
                        </div>
                        <ChevronsUpDownIcon className="size-4"></ChevronsUpDownIcon>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="end"
                    sideOffset={4}
                    side={isMobile ? "bottom" : "right"}
                  >
                    <DropdownMenuItem>
                      <SettingsIcon className="size-6"></SettingsIcon>
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOutIcon className="size-6"></LogOutIcon>
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail></SidebarRail>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 sticky top-0 bg-white z-30 shadow-sm">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger
                className="size-8"
                onClick={() => console.log("toggle sidebar")}
              />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex justify-between flex-1">
                <h1 className="text-lg">
                  {navItems.find((item) => item.link === location.pathname)
                    ?.label || "Home"}
                </h1>
                <div className="">ICON</div>
              </div>
            </div>
          </header>
          {/* <Separator orientation="horizontal" /> */}
          <main className="px-4 py-3">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default SidebarContainer;
