import FeedItemCard from "@/components/FeedItemCard/FeedItemCard";
import useAuth from "@/hooks/useAuth";
import { singleFeedQueryOptions } from "@/queries/singleFeed";
import { queryClient } from "@/routes/__root";
import { SingleFeed } from "@/types/feed";
import { User } from "@/types/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/subscriptions/$feedId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const userInfo = queryClient.getQueryData(["auth"]);
    const user = userInfo as User;

    return await queryClient.ensureQueryData(
      singleFeedQueryOptions(params.feedId, user)
    );
  },
});

function RouteComponent() {
  const { feedId } = useParams({ from: "/_protected/subscriptions/$feedId/" });
  const { user } = useAuth();
  const query = useSuspenseQuery(singleFeedQueryOptions(feedId, user))
    .data as SingleFeed;
  const feedInfo = query.user_feed[0];
  console.log(query);

  return (
    <div>
      <Link to="/home" from="/subscriptions/$feedId">
        back?
      </Link>
      <p>'Hello /_protected/subscriptions/$feedId!' with id: ${feedId}</p>
      <div>
        {query.rss_data.items.map((item, i) => {
          return (
            <Link
              to="/subscriptions/$feedId/$feedItemId"
              key={item.source_link}
              params={{
                feedId: feedInfo._id,
                feedItemId: i.toString(),
              }}
              mask={{
                to: "/subscriptions/$feedId",
                params: { feedId: feedInfo._id },
                unmaskOnReload: false,
              }}
            >
              <FeedItemCard feedItem={item} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
