import AddCustomFeedTab from "@/components/Add-Feed/AddCustomFeedTab";
import AllFeedsTab from "@/components/Add-Feed/AllFeedsTab";
import ByCategoryTab from "@/components/Add-Feed/ByCategoryTab";
import { getUserFeeds } from "@/components/SidebarContainer/SidebarContainer";
import { Accordion } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import globalFeedsInfinite from "@/queries/globalFeedsInfinite";
import { queryClient } from "@/routes/__root";
import { FeedFromSidebar, GlobalFeed, GlobalFeedSchema } from "@/types/feed";
import fetch from "@/utils/fetch";
import {
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError, AxiosResponse } from "axios";
import { Helmet } from "react-helmet-async";

function AddFeedPage() {
  // const [globalFeeds, setGlobalFeeds] = useState<GlobalFeedList>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const userFeedsQuery = useQuery(getUserFeeds(user));
  const globalFeedsQuery = useSuspenseInfiniteQuery(globalFeedsInfinite());

  const addFeedMutation = useMutation({
    mutationFn: async (feed: GlobalFeed) => {
      const convertFeed = GlobalFeedSchema.safeParse(feed);
      if (!convertFeed.success) {
        throw new Error("Invalid feed format to add");
      }
      return await fetch.post(`/api/user/${user?.id}/feeds`, {
        url: convertFeed.data.url,
        title: convertFeed.data.title,
        category: convertFeed.data.category,
        owner: user?.id,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myFeeds"] });
      await queryClient.invalidateQueries({ queryKey: ["globalFeeds"] });
      await queryClient.invalidateQueries({ queryKey: ["home"] });
      await queryClient.invalidateQueries({
        queryKey: ["userSavedArticles"],
      });
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const handleAddFeed = (feed: GlobalFeed) => {
    if (user) {
      addFeedMutation.mutate(feed, {
        onSuccess: (res: AxiosResponse<{ id: string }>) => {
          toast({
            title: `${feed.title}, has been added to your feeds!`,
            duration: 4000,
            action: (
              <ToastAction
                altText="View Feed"
                onClick={() =>
                  navigate({
                    to: "/subscriptions/$feedId",
                    params: { feedId: res.data.id },
                  })
                }
              >
                View Feed
              </ToastAction>
            ),
          });
        },
        onError: (e) => {
          if (e instanceof AxiosError) {
            const message = e.response?.data?.errors[0]?.message as string;

            toast({
              title: "Uh oh! Error adding feed",
              variant: "destructive",
              description: "Reason: " + message,
              duration: 3000,
            });
          }
        },
      });
    }
  };

  const mappedUserFeeds = new Map(
    userFeedsQuery?.data?.map((f: FeedFromSidebar) => [f.url, true])
  );

  return (
    <div className="tab-container pb-6 pt-4 px-3 md:max-w-[750px] md:mx-auto transition-all duration-500">
      <Helmet>
        <title>News RSS - Add a feed</title>
      </Helmet>
      <Tabs defaultValue="feeds">
        <TabsList className="">
          <TabsTrigger value="feeds">Search Feeds</TabsTrigger>
          <TabsTrigger value="add_my_own">Add My Own Feed</TabsTrigger>
        </TabsList>
        <TabsContent value="feeds">
          {/* defaultValue="by_all" */}
          <Accordion type="single" collapsible>
            <ByCategoryTab
              mappedUserFeeds={mappedUserFeeds}
              handleAddFeed={handleAddFeed}
              addIsPending={addFeedMutation.isPending}
            />
            <AllFeedsTab
              globalFeeds={globalFeedsQuery}
              mappedUserFeeds={mappedUserFeeds}
              handleAddFeed={handleAddFeed}
              addIsPending={addFeedMutation.isPending}
            />
          </Accordion>
        </TabsContent>
        <TabsContent value="add_my_own">
          {user ? (
            <AddCustomFeedTab user={user} />
          ) : (
            <p>You must be signed in to create feeds.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default AddFeedPage;
