import FeedPageSection from "@/components/FeedItemCard/FeedPageSection";
import FeedItemCardSkeleton from "@/components/Loading/FeedItemCardSkeleton";
import useAuth from "@/hooks/useAuth";
import { singleFeedQueryOptions } from "@/queries/singleFeed";
import { queryClient } from "@/routes/__root";
import { SingleFeed } from "@/types/feed";
import { User } from "@/types/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import { AxiosError, AxiosResponse } from "axios";

export const Route = createFileRoute("/_protected/subscriptions/$feedId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const userInfo = queryClient.getQueryData(["user"]) as AxiosResponse;
    const user = userInfo.data?.user as User;

    try {
      return await queryClient.ensureQueryData(
        singleFeedQueryOptions(params.feedId, user)
      );
    } catch (error) {
      // console.log("loader->", error);
      if (error instanceof AxiosError) {
        if (error.status === 404) {
          throw notFound();
        }
      }
    }
  },
  notFoundComponent: () => <p>my 404 page</p>,
  pendingComponent: () => (
    <div className="flex flex-col max-w-[1000px] mx-auto gap-4 ">
      {Array.from({ length: 7 }).map((_, i) => (
        <FeedItemCardSkeleton key={i} />
      ))}
    </div>
  ),
});

function RouteComponent() {
  const { feedId } = useParams({ from: "/_protected/subscriptions/$feedId/" });
  const { user } = useAuth();
  const query = useSuspenseQuery(singleFeedQueryOptions(feedId, user))
    .data as SingleFeed;
  const feedInfo = query.user_feed[0];
  // console.log(query, feedInfo._id);

  return (
    <div className="container mx-auto pt-4 relative">
      <FeedPageSection
        feed={query.rss_data}
        feedData={feedInfo}
        isInfinitePagination={false}
      />
    </div>
  );
}
