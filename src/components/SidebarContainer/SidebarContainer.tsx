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
  SidebarMenuAction,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import {
  HomeIcon,
  PlusIcon,
  RssIcon,
  SearchIcon,
  SettingsIcon,
  MailQuestion,
  LogOutIcon,
  ChevronsUpDownIcon,
  LucideProps,
  MoreHorizontal,
  Trash2Icon,
  FolderOpenIcon,
  FolderIcon,
  FolderHeartIcon,
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
import { useDeleteMyFeed } from "@/hooks/useDeleteMyFeed";
import { AxiosError } from "axios";

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
    link: "/home",
    linkName: "",
  },
  {
    id: 1,
    label: "Search in feed",
    icon: SearchIcon,
    iconClassName: "size-6",
    linkName: "search-in-feed",
    link: "/home",
  },
  {
    id: 2,
    label: "Add new feed",
    icon: PlusIcon,
    iconClassName: "size-6",
    linkName: "",
    variant: "outline",
    link: "/subscribe/feeds",
  },
  {
    id: 3,
    label: "Saved articles",
    icon: FolderHeartIcon,
    iconClassName: "size-6",
    linkName: "",
    link: "/subscriptions/favorites",
  },
];
const navFeeds: Array<{ [index: string]: any }> = [];

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
  const bar = useSidebar();
  const handleDeleteFeed = (feedId: string) => {
    if (user) {
      myFeedMutate.mutate({ feedId });
    }
  };

  const myFeeds = useQuery(getUserFeeds(user));
  const myFeedMutate = useDeleteMyFeed(user);
  // console.log("sidebar feeds", feedsQuery.data?.data?.user_feeds);
  // console.log("sidebar pathname", location.pathname);
  // console.log("myFeeds", myFeeds);

  useEffect(() => {
    if (isMobile) {
      bar.toggleSidebar();
    }
  }, [location.pathname]);

  if (myFeeds.status === "error" && !myFeeds.isLoading) {
    console.log("myfeeds error", myFeeds.error);
    if (myFeeds.error instanceof AxiosError) {
      const statusCode = myFeeds.error.status;
      if (statusCode === 401) {
        window.location.replace(`/signin?redirect=${location.pathname}`);
      } else {
        throw myFeeds.error;
      }
    }
    return null;
  }

  return (
    <>
      {/* <div className="content flex flex-col min-h-screen w-full"> */}
      {/* <SidebarProvider className="group" open={cookies["sidebar:state"]}> */}
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-lg" asChild>
                <Link href="/home">
                  <RssIcon className="size-10" strokeWidth={3}></RssIcon>
                  <span className="font-bold">News RSS</span>
                </Link>
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
            <SidebarGroupLabel>My Feeds (uses Link isActive)</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {myFeeds.isLoading ? (
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton className=""></SidebarMenuSkeleton>
                  </SidebarMenuItem>
                ) : (myFeeds?.data?.length || 0) > 0 && myFeeds.isSuccess ? (
                  myFeeds.data?.map((feed) => (
                    <SidebarMenuItem key={feed._id}>
                      <SidebarMenuButton
                        className=""
                        tooltip={feed.title}
                        asChild
                      >
                        <Link
                          to={`/subscriptions/$feedId`}
                          params={{ feedId: feed?._id }}
                          className=""
                          preload="intent"
                        >
                          {({ isActive }) => (
                            <>
                              {isActive ? <FolderOpenIcon /> : <FolderIcon />}
                              <span
                                className={`${isActive && "font-semibold"}`}
                              >
                                {feed.title}
                              </span>
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction>
                            <MoreHorizontal />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side={isMobile ? "bottom" : "right"}
                          align={isMobile ? "end" : "start"}
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/subscriptions/$feedId`}
                              params={{ feedId: feed?._id }}
                              preload="intent"
                            >
                              <FolderOpenIcon />

                              <span>View page</span>
                            </Link>
                          </DropdownMenuItem>
                          <SidebarSeparator orientation="horizontal"></SidebarSeparator>
                          <DropdownMenuItem
                            onClick={() => handleDeleteFeed(feed._id)}
                          >
                            <Trash2Icon />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))
                ) : (
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
            <SidebarTrigger className="size-8" />
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
        <div className="px-4 pt-3">
          <div className="page-container max-w-[1100px] mx-auto">
            {children}
          </div>
        </div>
      </SidebarInset>
      {/* </SidebarProvider> */}
      {/* </div> */}
    </>
  );
}

export default SidebarContainer;
