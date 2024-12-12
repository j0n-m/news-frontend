import { ReactNode, useEffect } from "react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
  SidebarMenuSkeleton,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import {
  HomeIcon,
  PlusIcon,
  RssIcon,
  LucideProps,
  FolderHeartIcon,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Link, useLocation } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import fetch from "@/utils/fetch";
import useAuth from "@/hooks/useAuth";
import { FeedFromSidebar, FeedFromSidebarSchema } from "@/types/feed";
import { z } from "zod";
import { User } from "@/types/user";
import { useDeleteMyFeed } from "@/hooks/useDeleteMyFeed";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "@tanstack/react-router";
import SidebarAvatarMenu from "./SidebarAvatarMenu";
import SidebarFeed from "./SidebarFeed";
import useRenameMyFeed from "@/hooks/useRenameMyFeed";
import { queryClient } from "@/routes/__root";
// import { SidebarTitleContext } from "@/context/sidebarTitleContext";

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
    linkName: "home",
  },
  {
    id: 1,
    label: "Add new feed",
    icon: PlusIcon,
    iconClassName: "size-6",
    linkName: "subscribe",
    variant: "outline",
    link: "/subscribe/feeds",
  },
  {
    id: 2,
    label: "Saved articles",
    icon: FolderHeartIcon,
    iconClassName: "size-6",
    linkName: "subscriptions",
    link: "/subscriptions/favorites",
  },
];

export function getUserFeeds(user: User | null) {
  return queryOptions({
    queryKey: ["myFeeds"],
    queryFn: async () =>
      await fetch.get(`/api/user/${user?.id || ""}/feeds`, {
        withCredentials: true,
      }),
    placeholderData: keepPreviousData,
    enabled: !!user,
    retry: (failureCount) => {
      return failureCount < 2;
    },
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
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const myFeeds = useQuery(getUserFeeds(user));
  const myFeedMutate = useDeleteMyFeed(user);
  const renameFeedMutate = useRenameMyFeed();
  const bar = useSidebar();
  const handleDeleteFeed = (feed: FeedFromSidebar) => {
    if (user) {
      myFeedMutate.mutate(
        { feedId: feed._id },
        {
          onSuccess: () => {
            toast({
              title: `'${feed.title}', has been removed from your feeds`,
              duration: 3000,
            });
          },
        }
      );
    }
  };
  const handleRenameFeed = async (feedId: string, newFeedTitle: string) => {
    if (user) {
      await renameFeedMutate.mutateAsync(
        { user, feedId, newFeedTitle },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["myFeeds"],
            });
            queryClient.invalidateQueries({
              queryKey: ["userSavedArticles"],
            });
            queryClient.invalidateQueries({
              queryKey: ["home"],
            });
            queryClient.invalidateQueries({
              queryKey: ["singleFeed"],
            });
            toast({
              title: `Successfully renamed feed title to '${newFeedTitle}'`,
              duration: 3000,
            });
          },
        }
      );
    }
  };
  const myFeedMap = new Map(
    myFeeds.data?.map((feed) => {
      return [feed._id, feed.title];
    })
  );
  const sidebarItemsMap = new Map(
    navItems.map((item) => [item.linkName, item.label])
  );

  useEffect(() => {
    if (isMobile && bar.openMobile) {
      bar.toggleSidebar();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (myFeeds.status === "error" && !myFeeds.isLoading) {
      // console.log("myfeeds error", myFeeds.error);
      if (myFeeds.error instanceof AxiosError) {
        const statusCode = myFeeds.error.status;
        if (statusCode === 401) {
          // window.location.replace(`/signin?redirect=${location.pathname}`);
          navigate({ to: "/signin" });
          setTimeout(() => {
            toast({
              variant: "destructive",
              title: "Unauthorized",
              duration: 5000,
              description:
                "You are not authorized to access this page, please login.",
            });
          }, 200);
        } else {
          throw myFeeds.error;
        }
      }
    }
  }, [toast, myFeeds.isError]);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-lg" asChild>
                <Link to="/home">
                  <RssIcon className="size-10" strokeWidth={3}></RssIcon>
                  <span className="font-bold">News RSS</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="z-20">
            <SidebarGroupContent>
              <SidebarMenu className="">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      variant={item?.variant || "default"}
                      // isActive={item.link === location.pathname}
                      isActive={location.pathname.includes(item.linkName)}
                      asChild
                    >
                      <Link to={item.link}>
                        {({ isActive }) => (
                          <>
                            <item.icon></item.icon>
                            <span
                              className={`${isActive ? "font-semibold" : ""}`}
                            >
                              {item.label}
                            </span>
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarSeparator orientation="horizontal"></SidebarSeparator>
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
                    <SidebarFeed
                      key={feed._id}
                      feed={feed}
                      isMobile={isMobile}
                      handleDelete={handleDeleteFeed}
                      handleRenameFeed={handleRenameFeed}
                    />
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
          {user && (
            <SidebarAvatarMenu
              signOut={signOut}
              user={user}
              isMobile={isMobile}
              isInSidebar={true}
            />
          )}
        </SidebarFooter>
        {/* <SidebarRail /> */}
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 sticky top-0 bg-white z-30 shadow-sm">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="size-8" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between flex-1">
              <h1 className="text-lg">
                {myFeedMap.get(location.pathname.split("/")[2]) ||
                  sidebarItemsMap.get(location.pathname.split("/")[1]) ||
                  "Home"}
              </h1>
              {/* <div className="flex gap-2 items-center">
                {sidebarInsetObj.icon && (
                  <sidebarInsetObj.icon size={20}></sidebarInsetObj.icon>
                )}
                <h1 className="font-bold">{sidebarInsetObj.title}</h1>
              </div> */}

              {isMobile && user ? (
                <div className="">
                  <SidebarAvatarMenu
                    signOut={signOut}
                    user={user}
                    isMobile={isMobile}
                    isInSidebar={false}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <div className="md:px-4 md:pt-3 bg-sidebar-accent min-h-svh">
          <div className="page-container max-w-[1000px] md:mx-auto relative bg-white px-4 pt-2 md:px-4 lg:px-6 lg:pt-4 rounded-lg">
            {children}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

export default SidebarContainer;
