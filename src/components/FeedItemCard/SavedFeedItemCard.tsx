import { SavedFeedItem } from "@/types/feed";
import moment from "moment";

type SavedFeedItemCardProps = {
  savedFeedItem: SavedFeedItem;
};

function SavedFeedItemCard({ savedFeedItem }: SavedFeedItemCardProps) {
  const cardDate = moment(new Date(savedFeedItem.data.pubDate)).format("ll");

  return (
    <div className="saved-feed-item-card pb-4 pt-1 lg:pb-6 lg:pt-1">
      <div className="grid grid-cols-[1fr,120px] md:grid-cols-[1fr,150px] gap-2">
        <div className="left-side">
          <p className="original-feed-title text-gray-500 text-sm mb-2">
            {savedFeedItem?.feed?.title ||
              savedFeedItem?.fallback_feed_title ||
              ""}
            {!savedFeedItem?.feed?.title && <span> (Deleted feed)</span>}
          </p>
          <h2 className="md:text-lg overflow-hidden">
            {savedFeedItem.data.title}
          </h2>
          <p className="text-gray-500 text-sm mt-2">{cardDate}</p>
        </div>
        <div className="right-side flex justify-center items-start rounded-md">
          {savedFeedItem.data.image_url && (
            <img
              src={savedFeedItem.data.image_url}
              role="presentation"
              loading="lazy"
              className="object-center object-cover rounded-md w-full aspect-video"
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default SavedFeedItemCard;
