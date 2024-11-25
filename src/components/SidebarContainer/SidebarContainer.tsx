import { ReactNode, useEffect, useState } from "react";
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
  SidebarMenuSkeleton,
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
import { Link, Navigate, useLocation } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import fetch from "@/utils/fetch";
import useAuth from "@/hooks/useAuth";
import { useCookies } from "react-cookie";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { FeedFromSidebarSchema } from "@/types/feed";
import { z } from "zod";
import { User } from "@/types/user";

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
  {
    id: 3,
    label: "Test link",
    icon: MailQuestion,
    iconClassName: "size-6",
    linkName: "",
    link: "/test",
  },
];
const navFeeds = [];

export function getUserFeeds(user: User | null) {
  return queryOptions({
    queryKey: ["myFeeds"],
    queryFn: async () =>
      await fetch.get(`/api/user/${user?.id || ""}/feeds`, {
        withCredentials: true,
      }),
    placeholderData: keepPreviousData,
    enabled: !!user,
    // throwOnError: true,
    select: (res) => {
      const parseRes = z
        .array(FeedFromSidebarSchema)
        .safeParse(res.data?.user_feeds);
      if (parseRes.success) {
        return parseRes.data;
      } else {
        // throw new Error("Error in parsing feed data");
        console.error("Error in parsing feed data");
        return [];
      }
    },
  });
}

function SidebarContainer({ children }: SidebarContainerProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signOut, user } = useAuth();
  // const [myFeeds, setMyFeeds] = useState<FeedFromSidebar[]>([]);
  const [cookies] = useCookies(["sidebar:state"]);

  const myFeeds = useQuery(getUserFeeds(user));
  // console.log("sidebar feeds", feedsQuery.data?.data?.user_feeds);
  // console.log("sidebar pathname", location.pathname);

  // useEffect(() => {
  //   if (feedsQuery.data) {
  //     const parseRes = z
  //       .array(FeedFromSidebarSchema)
  //       .safeParse(feedsQuery.data?.data?.user_feeds);
  //     if (parseRes.success) {
  //       setMyFeeds(parseRes.data);
  //     } else {
  //       throw new Error("Error in parsing feed data");
  //     }
  //   }
  // }, [feedsQuery.isSuccess, feedsQuery.data]);

  if (myFeeds.status === "error") {
    window.location.replace(`/signin?redirect=${location.pathname}`);
    return null;
  }

  return (
    <div className="content flex flex-col min-h-screen">
      <SidebarProvider className="group" open={cookies["sidebar:state"]}>
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
                          preload="intent"
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
                  {myFeeds.isLoading ? (
                    <SidebarMenuItem>
                      <SidebarMenuSkeleton className=""></SidebarMenuSkeleton>
                    </SidebarMenuItem>
                  ) : (myFeeds?.data?.length || 0) > 0 && myFeeds.isSuccess ? (
                    myFeeds.data?.map((feed) => (
                      <SidebarMenuItem key={feed._id}>
                        <SidebarMenuButton>
                          <span>{feed.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <p className="px-2 italic group-data-[state=collapsed]:hidden">
                      You have no feeds
                    </p>
                  )}

                  {/* <p className="px-2 italic group-data-[state=collapsed]:hidden">
                      You have no feeds
                    </p> */}

                  {/* {navFeeds.map((feed, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton>
                        <span>something</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))} */}
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
                      tooltip={`${user?.first_name}'s account`}
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="size-8">
                        <AvatarFallback>{`${user?.first_name[0] || ""}${user?.last_name[0] || ""}`}</AvatarFallback>
                      </Avatar>
                      <span>{user?.first_name}</span>
                      <ChevronsUpDownIcon className="size-4 ml-auto"></ChevronsUpDownIcon>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="end"
                    sideOffset={4}
                    side={isMobile ? "bottom" : "right"}
                  >
                    <DropdownMenuItem disabled={true}>
                      <SettingsIcon className="size-6"></SettingsIcon>
                      <span className="line-through">Settings</span>
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
          <div className="px-4 pt-3">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default SidebarContainer;
