import { Feed, FeedFromSidebar, SavedFeedItem } from "@/types/feed";
import { Link } from "@tanstack/react-router";
import FeedItemCard from "./FeedItemCard";
import { useEffect } from "react";
import FeedItemCardSettingsBtn from "./FeedItemCardSettingsBtn";
import { FolderHeartIcon } from "lucide-react";

type FeedPageSectionProps = {
  feed: Feed;
  pageIndex?: number;
  isInfinitePagination: boolean;
  feedData?: FeedFromSidebar;
  favoritesMap?: Map<string, SavedFeedItem>;
};

function FeedPageSection({
  feed,
  isInfinitePagination,
  pageIndex,
  feedData,
  favoritesMap,
}: FeedPageSectionProps) {
  useEffect(() => {
    if (isInfinitePagination && Number(pageIndex) < 0) {
      console.error("You must provide a page index with Infinite pagination!");
    }
  }, [isInfinitePagination]);

  return (
    <div key={feed.feed_link} className="mb-4 border-b">
      <div>
        <h1 className="font-bold text-xl text-[#006AB6] hover:text-[#0080DB] focus-visible:text-[#0080DB] active:text-[#0080DB] transition-colors duration-200 w-max">
          <Link to="/subscriptions/$feedId" params={{ feedId: feed?.id }}>
            {feedData?.title || feed.feed_title}
          </Link>
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        {feed.items.map((feedItem, i) => {
          if (isInfinitePagination && Number(pageIndex) >= 0) {
            return (
              <div className="card" key={feedItem.id}>
                <div className="card-settings flex justify-end items-center">
                  {favoritesMap?.get(feedItem.source_link) && (
                    <span title="Article is saved">
                      <FolderHeartIcon className="size-4 mr-2"></FolderHeartIcon>
                    </span>
                  )}

                  <FeedItemCardSettingsBtn
                    webLink={feedItem.source_link}
                    favoritesMap={favoritesMap}
                    feed={feed}
                    feedItemIndex={i}
                  />
                </div>
                <Link
                  to="/subscriptions/$feedId/$feedItemId/$page"
                  params={{
                    feedId: feed.id,
                    feedItemId: feedItem.id.toString(),
                    page: Number(pageIndex).toString(),
                  }}
                  mask={{
                    to: "/subscriptions/$feedId",
                    params: { feedId: feed.id },
                    unmaskOnReload: false,
                  }}
                >
                  <FeedItemCard
                    isInfinitePagination={isInfinitePagination}
                    pageIndex={Number(pageIndex)}
                    feedItem={feedItem}
                    cName={`pb-4 pt-1 lg:pb-6 lg:pt-1`}
                  />
                </Link>
              </div>
            );
          } else {
            if (!feedData) return null;
            return (
              <div className="card" key={feedItem.id}>
                <div className="card-settings flex justify-end items-center">
                  {favoritesMap?.get(feedItem.source_link) && (
                    <span title="Article is saved">
                      <FolderHeartIcon className="size-4 mr-2"></FolderHeartIcon>
                    </span>
                  )}
                  <FeedItemCardSettingsBtn
                    webLink={feedItem.source_link}
                    favoritesMap={favoritesMap}
                    feed={feed}
                    feedItemIndex={i}
                  />
                </div>
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
                  <FeedItemCard
                    feedItem={feedItem}
                    cName={`pb-4 pt-1 lg:pb-6 lg:pt-1`}
                  />
                </Link>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
export default FeedPageSection;
