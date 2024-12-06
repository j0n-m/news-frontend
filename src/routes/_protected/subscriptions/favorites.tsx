import UserSavedArticlesInfiniteOptions from "@/queries/UserSavedArticlesInfiniteOptions";
import { queryClient } from "@/routes/__root";
import { User } from "@/types/user";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SavedFeedItemCard from "@/components/FeedItemCard/SavedFeedItemCard";

export const Route = createFileRoute("/_protected/subscriptions/favorites")({
  component: RouteComponent,
  loader: async () => {
    const cachedUser = queryClient.getQueryData(["user"]) as AxiosResponse;
    if (!cachedUser) {
      throw redirect({
        to: "/signin",
      });
    }
    const user = cachedUser.data?.user as User;
    return await queryClient.ensureInfiniteQueryData(
      UserSavedArticlesInfiniteOptions(user.id)
    );
  },
});

function RouteComponent() {
  const cachedUser = queryClient.getQueryData(["user"]) as AxiosResponse;
  const user = cachedUser.data?.user as User;
  const { ref, inView } = useInView();
  const savedFeedQuery = useSuspenseInfiniteQuery(
    UserSavedArticlesInfiniteOptions(user.id)
  );
  // console.log(savedFeedQuery.data);

  useEffect(() => {
    if (savedFeedQuery.hasNextPage && inView) {
      console.log("fetching next page");
      savedFeedQuery.fetchNextPage();
    }
  }, [inView]);

  return savedFeedQuery.status === "error" ? (
    <div>
      <h1 className="text-2xl font-bold text-center">
        Error retrieving your feed
      </h1>
      <div className="mt-4 flex items-center justify-center">
        <a
          href="/"
          className="bg-sidebar hover:bg-sidebar-accent px-4 py-1 rounded-md"
        >
          Refresh your feed
        </a>
      </div>
    </div>
  ) : (
    <div className="container mx-auto pt-4 relative mb-4">
      <div>
        <h1 className="font-bold text-xl">{"Saved Articles"}</h1>
      </div>
      {savedFeedQuery.data.pages.map((page, pageIndex) => {
        return (
          <div className="flex flex-col gap-4 pb-3" key={pageIndex}>
            {page.saved_feed_items.map((savedFeed, i) => {
              return (
                <Link
                  key={savedFeed._id}
                  to="/subscriptions/favorites/$page/$arrIndex"
                  params={{
                    arrIndex: i.toString(),
                    page: pageIndex.toString(),
                  }}
                >
                  <SavedFeedItemCard savedFeedItem={savedFeed} />
                </Link>
              );
            })}
          </div>
        );
      })}
      {savedFeedQuery.data.pages[0].saved_feed_items.length === 0 && (
        <p className="pb-4 italic">You have no saved articles.</p>
      )}
      {savedFeedQuery.hasNextPage && (
        <div ref={ref} className="text-center relative">
          <div className="absolute left-[50%] -bottom-2 size-6 rounded-full bg-transparent border-t-blue-500 border-[4px] animate-[spin_.8s_linear_infinite]"></div>
        </div>
      )}
    </div>
  );
}
