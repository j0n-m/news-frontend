import { HTMLAttributes } from "react";
import { FeedItem } from "../../types/feed";
import moment from "moment";
import { cn } from "@/lib/utils";

type DivClassName = HTMLAttributes<HTMLDivElement>["className"];
type FeedItemCardProps = {
  feedItem: FeedItem;
  feedId?: string;
  cName?: DivClassName;
  isInfinitePagination?: boolean;
  pageIndex?: number;
};
const FeedItemCard = ({ feedItem, cName }: FeedItemCardProps) => {
  const momentDate = moment(feedItem.pubDate);
  const cardDate =
    momentDate.toDate() > new Date()
      ? momentDate.format("ll")
      : moment(momentDate).fromNow();

  return (
    <div
      className={cn(`feed-item-card py-4 px-1 lg:py-6 cursor-pointer`, cName)}
    >
      <div className="grid grid-cols-[1fr,120px] md:grid-cols-[1fr,150px] gap-2">
        <div className="left-side">
          <h2 className="md:text-lg overflow-hidden">{feedItem.title}</h2>
          <p className="text-gray-500 text-sm mt-2">{cardDate}</p>
        </div>
        <div className="right-side flex justify-center items-start rounded-md">
          {feedItem.image_url && (
            <img
              src={feedItem.image_url}
              role="presentation"
              loading="lazy"
              // className="object-cover rounded-md w-[100px] max-h-[80px]"
              className="object-center object-cover rounded-md w-full aspect-video"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedItemCard;
