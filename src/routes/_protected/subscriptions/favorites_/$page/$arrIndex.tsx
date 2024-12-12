import { queryClient } from "@/routes/__root";
import {
  createFileRoute,
  redirect,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { User } from "@/types/user";
import { InfiniteData, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import UserSavedArticlesInfiniteOptions from "@/queries/UserSavedArticlesInfiniteOptions";
import { AxiosResponse } from "axios";
import { SavedFeed } from "@/types/feed";
import FeedDetails from "@/components/FeedItemPage/FeedDetails";
import NotFoundPage from "@/pages/404/NotFoundPage";
import { QuerySearch } from "../../favorites";

export const Route = createFileRoute(
  "/_protected/subscriptions/favorites_/$page/$arrIndex"
)({
  component: RouteComponent,
  notFoundComponent: () => <NotFoundPage />,
  validateSearch: (search: Record<string, unknown>): QuerySearch => {
    return {
      q: search?.q as string,
    };
  },
  loaderDeps: ({ search }) => {
    return {
      q: search.q,
    };
  },
  beforeLoad: async ({ params: { page, arrIndex }, search: { q } }) => {
    //redirect if not cached or params are out of range

    const cachedList = queryClient.getQueryData([
      "userSavedArticles",
      { q: q },
    ]) as InfiniteData<SavedFeed>;
    const item =
      cachedList?.pages[parseInt(page)]?.saved_feed_items[parseInt(arrIndex)]
        ?._id;
    if (!cachedList || !item) {
      throw redirect({
        to: "/subscriptions/favorites",
        replace: true,
      });
    }
  },
});

function RouteComponent() {
  const { page, arrIndex } = useParams({
    from: "/_protected/subscriptions/favorites_/$page/$arrIndex",
  });
  const query = useSearch({
    from: "/_protected/subscriptions/favorites_/$page/$arrIndex",
  });
  const cachedUser = queryClient.getQueryData(["user"]) as AxiosResponse;
  const user = cachedUser.data?.user as User;

  const savedFeedQuery = useSuspenseInfiniteQuery(
    UserSavedArticlesInfiniteOptions(user.id, query.q)
  );
  const feed =
    savedFeedQuery.data.pages[Number(page)].saved_feed_items[Number(arrIndex)];
  const feedItem = feed?.data;

  return (
    <>
      {savedFeedQuery && (
        <FeedDetails
          feedItem={feedItem}
          feedId={feed?.feed?._id || ""}
          feedTitle={feed.feed?.title || feed.fallback_feed_title}
        ></FeedDetails>
      )}
    </>
  );
}
