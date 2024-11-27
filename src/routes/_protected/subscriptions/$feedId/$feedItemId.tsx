import { queryClient } from "@/routes/__root";
import { SingleFeed } from "@/types/feed";
import {
  redirect,
  createFileRoute,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import { AxiosResponse } from "axios";

export const Route = createFileRoute(
  "/_protected/subscriptions/$feedId/$feedItemId"
)({
  component: RouteComponent,
  loader: async ({ params: { feedId } }) => {
    const cachedFeedList = queryClient.getQueryData([
      "singleFeed",
      feedId,
    ]) as AxiosResponse<SingleFeed>;
    if (!cachedFeedList) {
      throw redirect({
        to: "/subscriptions/$feedId",
        params: { feedId },
      });
    }
    return cachedFeedList;
  },
});

function RouteComponent() {
  const feedItem = useLoaderData({
    from: "/_protected/subscriptions/$feedId/$feedItemId",
  });
  const { feedItemId } = useParams({
    from: "/_protected/subscriptions/$feedId/$feedItemId",
  });
  // console.log(feedItem);
  return (
    <div>
      <p>Hello /_protected/subscriptions/$feedId/$feedItemId!</p>
      <p>itemid: {feedItemId}</p>
      <p>{feedItem.data.rss_data.items[parseInt(feedItemId)].title}</p>
    </div>
  );
}
