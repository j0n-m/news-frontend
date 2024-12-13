import FeedPageSection from "@/components/FeedItemCard/FeedPageSection";
import FeedItemCardSkeleton from "@/components/Loading/FeedItemCardSkeleton";
import useAuth from "@/hooks/useAuth";
import NotFoundPage from "@/pages/404/NotFoundPage";
import { singleFeedQueryOptions } from "@/queries/singleFeed";
import { queryClient } from "@/routes/__root";
import { SavedFeedItem, SingleFeed } from "@/types/feed";
import { User } from "@/types/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import { AxiosError, AxiosResponse } from "axios";
import { Helmet } from "react-helmet-async";

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
  notFoundComponent: () => <NotFoundPage />,
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
  const favoritesMap: Map<string, SavedFeedItem> = new Map();

  query?.savedFeedInfo?.forEach((d) => {
    favoritesMap.set(d._id, d.feed_info);
  });

  return (
    <div className="container mx-auto pt-4 relative">
      <Helmet>
        <title>News RSS - {feedInfo.title}</title>
      </Helmet>
      <FeedPageSection
        feed={query.rss_data}
        feedData={feedInfo}
        isInfinitePagination={false}
        favoritesMap={favoritesMap}
      />
    </div>
  );
}
