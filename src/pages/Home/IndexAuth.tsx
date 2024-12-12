import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";
import { homeFeeds } from "@/queries/homeFeeds";
import FeedPageSection from "@/components/FeedItemCard/FeedPageSection";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavedFeedItem } from "@/types/feed";

function useHomeFeeds() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useSuspenseInfiniteQuery(homeFeeds());

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
    isFetchingNextPage,
  };
}
function IndexAuth() {
  const { data, fetchNextPage, hasNextPage, status } = useHomeFeeds();
  // const { setFeedItemData } = useSelectedFeedItem();
  const favoritesMap: Map<string, SavedFeedItem> = new Map();
  data.pages.forEach((page) => {
    page?.savedFeedInfo?.forEach((d) => {
      favoritesMap.set(d._id, d.feed_info);
    });
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  return status === "error" ? (
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
  ) : status === "success" ? (
    <div className="container mx-auto pt-4 relative">
      {data?.pages?.map((page, pageIndex) => {
        return (
          <Fragment key={pageIndex}>
            {page?.data?.map((feed, i) => {
              return (
                <FeedPageSection
                  key={i}
                  feed={feed}
                  isInfinitePagination={true}
                  pageIndex={pageIndex}
                  favoritesMap={favoritesMap}
                />
              );
            })}
          </Fragment>
        );
      })}
      {data?.pages[0]?.data?.length === 0 && (
        <div className="pb-8">
          <Card className="max-w-[350px] mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Home Feeds</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>You have no feeds.</p>
              <p>Consider subscribing to a couple feeds to get started.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link to="/subscribe/feeds">Browse Feeds</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      <div
        className={`${hasNextPage ? "" : "hidden"} absolute -bottom-[2rem] bg-transparent pointer-events-none left-[50%] -translate-x-[50%] after:content-[""] after:absolute pt-[10rem] after:bg-transparent`}
        ref={ref}
      >
        {hasNextPage ? (
          <div className="absolute left-0 bottom-0 size-6 rounded-full bg-transparent border-t-blue-500 border-[4px] animate-[spin_.8s_linear_infinite]"></div>
        ) : (
          "End"
        )}
      </div>
    </div>
  ) : null;
}

export default IndexAuth;
