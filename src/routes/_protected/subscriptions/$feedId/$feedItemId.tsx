import FeedDetails from "@/components/FeedItemPage/FeedDetails";
import { singleFeedQueryOptions } from "@/queries/singleFeed";
import { queryClient } from "@/routes/__root";
import { SingleFeed } from "@/types/feed";
import { User } from "@/types/user";
import {
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { redirect, createFileRoute, useParams } from "@tanstack/react-router";
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
  const params = useParams({
    from: "/_protected/subscriptions/$feedId/$feedItemId",
  });
  const userCache = queryClient.getQueryData(["user"]) as AxiosResponse<User>;
  const user = userCache.data;

  const singleFeedQuery = useSuspenseQuery(
    singleFeedQueryOptions(params.feedId, user)
  ) as UseSuspenseQueryResult<SingleFeed>;

  const feedItemId = singleFeedQuery.data?.user_feed[0]._id;
  const feedItem =
    singleFeedQuery.data.rss_data.items[Number(params.feedItemId)];

  return (
    <>
      {feedItem && (
        <FeedDetails
          feedItem={feedItem}
          feedId={feedItemId}
          feedTitle={singleFeedQuery.data.user_feed[0].title}
        />
      )}
    </>
  );
}
