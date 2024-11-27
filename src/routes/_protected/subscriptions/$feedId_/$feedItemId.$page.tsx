import { queryClient } from "@/routes/__root";
import { FeedResponse } from "@/types/feed";
import { InfiniteData } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  useLoaderData,
  useLocation,
  useParams,
} from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/subscriptions/$feedId_/$feedItemId/$page"
)({
  component: RouteComponent,
  loader: async () => {
    const cachedFeedList = queryClient.getQueriesData({
      queryKey: ["home"],
    });
    if (!cachedFeedList.length) {
      throw redirect({
        to: "/home",
      });
    }
    return cachedFeedList[0][1] as InfiniteData<FeedResponse>;
  },
});

function RouteComponent() {
  const data = useLoaderData({
    from: "/_protected/subscriptions/$feedId_/$feedItemId/$page",
  });
  const { page, feedId, feedItemId } = useParams({
    from: "/_protected/subscriptions/$feedId_/$feedItemId/$page",
  });
  const feedData = data.pages[parseInt(page)].data?.filter(
    (feed) => feed.id === feedId
  );
  const location = useLocation();
  const feedItem = feedData ? feedData[0].items[parseInt(feedItemId)] : null;
  console.log("location", location.pathname);
  if (!feedItem) {
    //navigate
    return null;
  }
  return (
    <div>
      <p>Hello /_protected/subscriptions/$feedId_/$feedItemId/$page!</p>
      <p className="text-xl font-bold mb-4">{feedItem.title}</p>
      <p>{feedItem.content_snippet}</p>
    </div>
  );
}
