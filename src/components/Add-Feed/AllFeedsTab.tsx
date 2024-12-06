import {
  InfiniteData,
  UseSuspenseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { GlobalFeed, GlobalFeedsResponse } from "@/types/feed";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import GlobalFeedsCard from "./GlobalFeedsCard";

type AllFeedsTabProps = {
  globalFeeds: UseSuspenseInfiniteQueryResult<
    InfiniteData<GlobalFeedsResponse>
  >;
  mappedUserFeeds: Map<string, boolean>;
  handleAddFeed: (feed: GlobalFeed) => void;
  addIsPending: boolean;
};
function AllFeedsTab({
  globalFeeds,
  mappedUserFeeds,
  handleAddFeed,
  addIsPending,
}: AllFeedsTabProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (globalFeeds.hasNextPage && inView) {
      console.log("fetching next page");
      globalFeeds.fetchNextPage();
    }
  }, [inView]);

  return (
    <AccordionItem value="by_all">
      <AccordionTrigger>All Feeds</AccordionTrigger>
      <AccordionContent>
        {globalFeeds.data.pages.map((page, pageIndex) => {
          return (
            <div key={pageIndex}>
              {page.feeds.map((feed) => (
                <GlobalFeedsCard
                  key={feed._id}
                  currentFeed={feed}
                  mappedUserFeeds={mappedUserFeeds}
                  handleAddFeed={handleAddFeed}
                  addIsPending={addIsPending}
                ></GlobalFeedsCard>
              ))}
            </div>
          );
        })}
        {globalFeeds.hasNextPage && (
          <div ref={ref} className="text-center relative">
            <div className="absolute left-[50%] -bottom-2 size-6 rounded-full bg-transparent border-t-blue-500 border-[4px] animate-[spin_.8s_linear_infinite]"></div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
export default AllFeedsTab;
