import { Link, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FeedItem, FeedResponseSchema } from "../../types/feed";
import { useInView } from "react-intersection-observer";
import FeedItemCard from "../../components/FeedItemCard/FeedItemCard";
import { Fragment, useEffect, useState } from "react";
import fetch from "../../utils/fetch";
import { ChevronLeftIcon } from "lucide-react";
import useSelectedFeedItem from "../../hooks/useSelectedFeedItem";
import { Button } from "react-aria-components";
import FeedHomeContainer from "../../components/FeedHomeContainer/FeedHomeContainer";

// function useHomeFeeds(deps: SearchDeps) {
//   const res = useSuspenseQuery(getHomeFeed(deps));
//   console.log(res.data.data);
//   const homeFeedData = FeedResponseSchema.safeParse(res.data.data);
//   if (!homeFeedData.success) {
//     console.error("invalid data was fetched.");
//   }
//   const homeFeed = homeFeedData.data;

//   return { homeFeed };
// }
function IndexAuth() {
  // const deps = useLoaderDeps({ from: "/" });
  // const { homeFeed } = useHomeFeeds(deps);
  // const homeFeed = {};
  const { setFeedItemData } = useSelectedFeedItem();
  const [pageData, setPageData] = useState<{
    feedItem: FeedItem;
    feedId: string;
  } | null>(null);
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const fetchFeeds = async ({ pageParam }: { pageParam: number | null }) => {
    const res = await fetch("/api/home?startIndex=" + pageParam);
    console.log(res.data);
    const feedSchemaRes = FeedResponseSchema.safeParse(res?.data);
    if (feedSchemaRes.success) {
      return feedSchemaRes.data;
    } else {
      console.error("invalid feed format");
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["home"],
    queryFn: fetchFeeds,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage?.nextStart,
    staleTime: 1000 * 60 * 3,
  });

  const handleCardClick = ({
    feedItem,
    feedId,
  }: {
    feedItem: FeedItem;
    feedId: string;
  }) => {
    console.log(feedItem);
    setFeedItemData(feedItem);
    navigate({ to: "/feed", mask: { to: "/", unmaskOnReload: false } });
    // setPageData({ feedId, feedItem });
  };

  useEffect(() => {
    // console.log(data);
    // console.log("inview is ", inView);
    if (hasNextPage && inView) {
      console.log("useEffect is fetching");
      fetchNextPage();
    }
  }, [inView]);

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <FeedHomeContainer>
      <div className="container py-4 relative">
        {data?.pages?.map((page, i) => {
          return (
            <Fragment key={i}>
              {page?.data?.map((feed, index) => {
                return (
                  <div key={index} className="mb-4 border-b">
                    <div>
                      <h1 className="font-bold text-xl">{feed.feed_title}</h1>
                    </div>
                    <div className="flex flex-col gap-4">
                      {feed.items.map((feedItem) => (
                        <button
                          className="text-start"
                          key={feedItem.id}
                          onClick={() =>
                            handleCardClick({
                              feedItem,
                              feedId: feed.feed_title,
                            })
                          }
                        >
                          <FeedItemCard
                            // key={feedItem.id}
                            feedItem={feedItem}
                            feedId={feed.feed_title}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </Fragment>
          );
        })}
        <div className="absolute bottom-1" ref={ref}>
          {hasNextPage ? "fetching more..." : ""}
        </div>
      </div>
    </FeedHomeContainer>
  );

  // return status === "pending" ? (
  //   <p>Loading...</p>
  // ) : status === "error" ? (
  //   <p>Error: {error.message}</p>
  // ) : (
  //   <div className="max-w-[1100px] mx-auto h-full border grid grid-cols-[1fr] md:grid-cols-[90px,auto] lg:grid-cols-[250px,auto]">
  //     <aside className="z-40 bg-white border fixed flex bottom-0 left-0 right-0 md:sticky md:flex-col md:top-0 md:left-0 md:bottom-0 lg:p-4">
  //       <div className="logo-section hidden md:block mb-4">
  //         <div className="text-xl font-bold">News Today</div>
  //       </div>
  //       <nav className="grid grid-cols-5 gap-2 md:grid-cols-1 place-items-center md:place-items-stretch md:w-full">
  //         <div>
  //           <Link to="/" className="border w-full block py-1 text-lg">
  //             Home
  //           </Link>
  //         </div>
  //         <div>
  //           <Link to="/" className="border w-full block py-1 text-lg">
  //             Profile
  //           </Link>
  //         </div>
  //       </nav>
  //     </aside>
  //     <main className="border p-4">
  //       <div className="main-container">
  //         {!pageData ? (
  //           data?.pages?.map((page, i) => {
  //             return (
  //               <Fragment key={i}>
  //                 {page?.data?.map((feed, index) => {
  //                   return (
  //                     <div key={index} className="mb-8 border-b">
  //                       <div>
  //                         <h1 className="font-bold text-xl">
  //                           {feed.feed_title}
  //                         </h1>
  //                       </div>
  //                       <div className="flex flex-col gap-4">
  //                         {feed.items.map((feedItem) => (
  //                           <button
  //                             className="text-start"
  //                             key={feedItem.id}
  //                             onClick={() =>
  //                               handleCardClick({
  //                                 feedItem,
  //                                 feedId: feed.feed_title,
  //                               })
  //                             }
  //                           >
  //                             <FeedItemCard
  //                               // key={feedItem.id}
  //                               feedItem={feedItem}
  //                               feedId={feed.feed_title}
  //                             />
  //                           </button>
  //                         ))}
  //                       </div>
  //                     </div>
  //                   );
  //                 })}
  //                 <div ref={ref}>
  //                   {hasNextPage ? "fetching more..." : "No more to fetch"}
  //                 </div>
  //               </Fragment>
  //             );
  //           })
  //         ) : (
  //           <div>
  //             <div className="border-b py-3 sticky z-10 bg-white top-0">
  //               <button
  //                 onClick={() => setPageData(null)}
  //                 className="flex items-center gap-1"
  //               >
  //                 <ChevronLeftIcon size={20} />
  //                 Back
  //               </button>
  //             </div>
  //             <div className="py-4">
  //               <p>{pageData.feedItem.title}</p>
  //               <p
  //                 dangerouslySetInnerHTML={{
  //                   __html: pageData?.feedItem?.content || "",
  //                 }}
  //               ></p>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </main>
  //   </div>
  // );
}

export default IndexAuth;
