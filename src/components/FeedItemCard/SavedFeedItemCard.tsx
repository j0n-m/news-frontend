import { SavedFeedItem } from "@/types/saved-feed";
import moment from "moment";

type SavedFeedItemCardProps = {
  savedFeedItem: SavedFeedItem;
};

function SavedFeedItemCard({ savedFeedItem }: SavedFeedItemCardProps) {
  const cardDate = moment(new Date(savedFeedItem.data.pubDate)).format("ll");
  return (
    <div className="saved-feed-item-card py-4 px-1 lg:py-6">
      <div className="grid grid-cols-[1fr,auto] md:grid-cols-[1fr,auto] gap-2">
        <div className="left-side">
          <p className="text-gray-500 text-sm mb-2">
            {savedFeedItem?.feed?.title ||
              savedFeedItem?.fallback_feed_title ||
              "Deleted Feed"}
          </p>
          <h2 className="md:text-lg">{savedFeedItem.data.title}</h2>
          <p className="text-gray-500 text-sm mt-2">{cardDate}</p>
        </div>
        <div className="right-side flex justify-center items-center rounded-md">
          {savedFeedItem.data.image_url && (
            <img
              src={savedFeedItem.data.image_url}
              role="presentation"
              loading="lazy"
              className="object-cover rounded-md w-full aspect-video h-[80px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default SavedFeedItemCard;
