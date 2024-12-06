import { Feed, FeedFromSidebar, FeedItem } from "@/types/feed";
import { Link, useNavigate } from "@tanstack/react-router";
import FeedItemCard from "./FeedItemCard";
import { useEffect } from "react";

type FeedPageSectionProps = {
  feed: Feed;
  pageIndex?: number;
  isInfinitePagination: boolean;
  feedData?: FeedFromSidebar;
};

function FeedPageSection({
  feed,
  isInfinitePagination,
  pageIndex,
  feedData,
}: FeedPageSectionProps) {
  const navigate = useNavigate();
  const handleNavigateWithInfinitePagination = async (
    pageIndex: number,
    feedItem: FeedItem
  ) => {
    await navigate({
      to: "/subscriptions/$feedId/$feedItemId/$page",
      params: {
        feedId: feed.id,
        feedItemId: feedItem.id.toString(),
        page: pageIndex.toString(),
      },
      mask: {
        to: "/subscriptions/$feedId",
        params: { feedId: feed.id },
        unmaskOnReload: false,
      },
    });
  };
  useEffect(() => {
    if (isInfinitePagination && Number(pageIndex) < 0) {
      console.error("You must provide a page index with Infinite pagination!");
    }
  }, [isInfinitePagination]);

  return (
    <div key={feed.feed_link} className="mb-4 border-b">
      <div>
        <h1 className="font-bold text-xl">
          {feedData?.title || feed.feed_title}
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        {feed.items.map((feedItem, i) => {
          if (isInfinitePagination && Number(pageIndex) >= 0) {
            return (
              <button
                className="text-start"
                key={feedItem.id}
                onClick={() =>
                  handleNavigateWithInfinitePagination(
                    Number(pageIndex),
                    feedItem
                  )
                }
              >
                <FeedItemCard feedItem={feedItem} />
              </button>
            );
          } else {
            if (!feedData) return null;
            return (
              <Link
                to="/subscriptions/$feedId/$feedItemId"
                key={feedItem.source_link}
                params={{
                  feedId: feedData._id,
                  feedItemId: i.toString(),
                }}
                mask={{
                  to: "/subscriptions/$feedId",
                  params: { feedId: feedData._id },
                  unmaskOnReload: false,
                }}
              >
                <FeedItemCard feedItem={feedItem} />
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
}
export default FeedPageSection;
