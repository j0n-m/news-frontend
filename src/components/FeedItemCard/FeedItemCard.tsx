import { FeedItem } from "../../types/feed";
import moment from "moment";

type FeedItemCardProps = {
  feedItem: FeedItem;
  feedId?: string;
  // handleCardClick: ({
  //   feedItem,
  //   feedId,
  // }: {
  //   feedItem: FeedItem;
  //   feedId: string;
  // }) => void;
};
const FeedItemCard = ({ feedItem }: FeedItemCardProps) => {
  const momentDate = moment(feedItem.pubDate);
  const cardDate =
    momentDate.toDate() > new Date()
      ? momentDate.format("ll")
      : moment(momentDate).fromNow();

  return (
    <div className="feed-item-card py-4 px-1 lg:py-6 cursor-pointer">
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
              loading="lazy"
              className="object-cover rounded-md w-[100px] max-h-[80px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedItemCard;
