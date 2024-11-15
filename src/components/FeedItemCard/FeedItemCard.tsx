import { FeedItem } from "../../types/feed";
import moment from "moment";

type FeedItemCardProps = {
  feedItem: FeedItem;
};
function FeedItemCard({ feedItem }: FeedItemCardProps) {
  const momentDate = moment(feedItem.pubDate);
  const cardDate =
    momentDate.toDate() > new Date()
      ? momentDate.format("ll")
      : moment(momentDate).fromNow();

  return (
    <div className="feed-item-card py-8">
      <div className="grid grid-cols-[1fr,100px] md:grid-cols-[1fr,100px] gap-2">
        <div className="left-side">
          <h2 className="md:text-lg">{feedItem.title}</h2>
          <p className="text-gray-500 text-sm mt-2">{cardDate}</p>
        </div>
        <div className="right-side flex justify-center rounded-md">
          {feedItem.image_url && (
            <img
              src={feedItem.image_url}
              role="presentation"
              className="object-cover rounded-md w-[100px] max-h-[100px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedItemCard;
