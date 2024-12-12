import { cn } from "@/lib/utils";
import { GlobalFeed } from "@/types/feed";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { CheckIcon } from "lucide-react";

type divProps = React.HTMLAttributes<HTMLDivElement>;

type GlobalFeedsCardProps = {
  props?: divProps;
  currentFeed: GlobalFeed;
  mappedUserFeeds: Map<string, boolean>;
  handleAddFeed: (feed: GlobalFeed) => void;
  addIsPending: boolean;
};
function GlobalFeedsCard({
  props,
  currentFeed,
  mappedUserFeeds,
  handleAddFeed,
}: GlobalFeedsCardProps) {
  const [addIsClicked, setAddIsClicked] = useState(false);
  return (
    <div
      className={cn(
        `card py-4 px-4 flex items-center justify-between border-b last:border-none`,
        props?.className
      )}
    >
      <div> {currentFeed.title}</div>
      <div>
        {mappedUserFeeds.get(currentFeed.url) ? (
          <>
            <Button
              variant={"secondary"}
              disabled={true}
              title="Subscribed"
              aria-label="Subscribed"
              size={"sm"}
            >
              <CheckIcon />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={"outline"}
              disabled={addIsClicked}
              title={`Subscribe to ${currentFeed.title}`}
              aria-label={`Subscribe to ${currentFeed.title}`}
              onClick={() => {
                handleAddFeed(currentFeed);
                setAddIsClicked(true);
              }}
              size={"sm"}
            >
              <PlusIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
export default GlobalFeedsCard;
