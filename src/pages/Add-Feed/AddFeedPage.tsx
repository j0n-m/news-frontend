import ErrorPage from "@/components/ErrorPage/Error";
import { getUserFeeds } from "@/components/SidebarContainer/SidebarContainer";
import useAuth from "@/hooks/useAuth";
import { queryClient } from "@/routes/__root";
import {
  FeedFromSidebar,
  GlobalFeedList,
  GlobalFeedListSchema,
} from "@/types/feed";
import fetch from "@/utils/fetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function AddFeedPage() {
  // const [globalFeeds, setGlobalFeeds] = useState<GlobalFeedList>([]);
  const { user } = useAuth();

  const userFeedsQuery = useQuery(getUserFeeds(user));

  const globalFeedsQuery = useQuery({
    queryKey: ["globalFeeds"],
    queryFn: async () => await fetch.get("/api/feeds"),
    // throwOnError: true,
    select(res) {
      const schemaRes = GlobalFeedListSchema.parse(res.data.feeds);
      return schemaRes;
    },
  });
  const addFeedMutation = useMutation({
    mutationFn: async (feed: GlobalFeedList[0]) => {
      return await fetch.post(`/api/user/${user?.id}/feeds`, {
        ...feed,
        owner: user?.id,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myFeeds"] });
      await queryClient.invalidateQueries({ queryKey: ["globalFeeds"] });
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const handleAddFeed = (feed: GlobalFeedList[0]) => {
    addFeedMutation.mutate(feed);
  };

  const mappedUserFeeds = new Map(
    userFeedsQuery?.data?.map((f: FeedFromSidebar) => [f.url, true])
  );
  // console.log(
  //   "mapped",
  //   mappedUserFeeds,
  // );

  // useEffect(() => {
  //   // console.log(globalFeedsQuery.data?.data);
  //   if (globalFeedsQuery.data && globalFeeds.length < 1) {
  //     const schemaRes = GlobalFeedListSchema.parse(
  //       globalFeedsQuery.data.data.feeds
  //     );
  //     setGlobalFeeds(schemaRes);
  //   }
  // }, [globalFeedsQuery.isSuccess]);

  return (
    <div>
      <div className="">
        <h1 className="text-2xl">Select from our feeds</h1>
        <div>
          {globalFeedsQuery.data?.map((feed) => (
            <div key={feed.url}>
              <div className="flex">
                <h3 className="mr-3">{feed.title}</h3>
                {mappedUserFeeds.get(feed.url) ? (
                  <button key={feed.url} disabled={true}>
                    subscribed
                  </button>
                ) : (
                  <button
                    key={feed.url}
                    onClick={() => handleAddFeed(feed)}
                    disabled={addFeedMutation.isPending}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl">Add your own URL</h2>
      </div>
    </div>
  );
}
export default AddFeedPage;
