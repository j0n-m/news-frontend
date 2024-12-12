import FeedDetails from "@/components/FeedItemPage/FeedDetails";
import NotFoundPage from "@/pages/404/NotFoundPage";
import { queryClient } from "@/routes/__root";
import { FeedResponse } from "@/types/feed";
import { InfiniteData } from "@tanstack/react-query";
import { createFileRoute, redirect, useParams } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/subscriptions/$feedId_/$feedItemId/$page"
)({
  component: RouteComponent,
  notFoundComponent: () => <NotFoundPage />,
  loader: async () => {
    const cachedFeedList = queryClient.getQueriesData({
      queryKey: ["home"],
    });
    if (!cachedFeedList.length) {
      throw redirect({
        to: "/home",
        replace: true,
      });
    }
    return cachedFeedList[0][1] as InfiniteData<FeedResponse>;
  },
});

function RouteComponent() {
  // const data = useLoaderData({
  //   from: "/_protected/subscriptions/$feedId_/$feedItemId/$page",
  // });
  const cachedFeedList = queryClient.getQueriesData({
    queryKey: ["home"],
  });
  const data = cachedFeedList[0][1] as InfiniteData<FeedResponse>;
  const { page, feedId, feedItemId } = useParams({
    from: "/_protected/subscriptions/$feedId_/$feedItemId/$page",
  });
  const feedData = data.pages[parseInt(page)].data?.filter(
    (feed) => feed.id === feedId
  );
  const feedItem = feedData ? feedData[0].items[parseInt(feedItemId)] : null;

  return (
    <>
      {feedItem && (
        <FeedDetails
          feedItem={feedItem}
          feedId={feedId}
          feedTitle={feedData![0].feed_title}
        ></FeedDetails>
      )}
    </>
  );
}
