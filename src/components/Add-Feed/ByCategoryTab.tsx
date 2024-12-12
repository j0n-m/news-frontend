import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useSuspenseQuery } from "@tanstack/react-query";
// import { GlobalFeedsResponse } from "@/types/feed";
import globalFeedsByCategoryQueryOptions from "@/queries/globalFeedsByCategoryQueryOptions";
import GlobalFeedsCard from "./GlobalFeedsCard";
import { GlobalFeed } from "@/types/feed";

type ByCategoryTabProps = {
  mappedUserFeeds: Map<string, boolean>;
  handleAddFeed: (feed: GlobalFeed) => void;
  addIsPending: boolean;
};
function ByCategoryTab({
  mappedUserFeeds,
  handleAddFeed,
  addIsPending,
}: ByCategoryTabProps) {
  const globalFeedsByCategory = useSuspenseQuery(
    globalFeedsByCategoryQueryOptions()
  );

  return (
    <AccordionItem value="by_category">
      <AccordionTrigger>By Category</AccordionTrigger>
      <AccordionContent>
        <Accordion
          type="single"
          collapsible
          className="bg-secondary rounded-md px-4"
        >
          {globalFeedsByCategory.data.feed_data.map((obj) => {
            return (
              <AccordionItem
                value={obj._id}
                key={obj._id}
                className="last:border-b-0"
              >
                <AccordionTrigger className="font-semibold">
                  {obj.category_info.name}
                </AccordionTrigger>
                <AccordionContent>
                  {obj.feeds.map((feed) => {
                    return (
                      <GlobalFeedsCard
                        key={feed.url}
                        currentFeed={feed}
                        mappedUserFeeds={mappedUserFeeds}
                        handleAddFeed={handleAddFeed}
                        addIsPending={addIsPending}
                        props={{ className: "px-4" }}
                      />
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
export default ByCategoryTab;
