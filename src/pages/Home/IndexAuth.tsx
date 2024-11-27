import { useNavigate } from "@tanstack/react-router";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { FeedItem } from "../../types/feed";
import { useInView } from "react-intersection-observer";
import FeedItemCard from "../../components/FeedItemCard/FeedItemCard";
import { Fragment, useEffect } from "react";
import useSelectedFeedItem from "../../hooks/useSelectedFeedItem";
import { homeFeeds } from "@/queries/homeFeeds";

function useHomeFeeds() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useSuspenseInfiniteQuery(homeFeeds());

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
    isFetchingNextPage,
  };
}
function IndexAuth() {
  const { data, fetchNextPage, hasNextPage, status } = useHomeFeeds();
  // const { setFeedItemData } = useSelectedFeedItem();
  const navigate = useNavigate();

  const { ref, inView } = useInView();

  // const handleCardClick = ({
  //   feedItem,
  //   feedId,
  // }: {
  //   feedItem: FeedItem;
  //   feedId: string;
  // }) => {
  //   console.log(feedItem);
  //   setFeedItemData(feedItem);
  //   navigate({ to: "/feed", mask: { to: "/", unmaskOnReload: false } });
  //   // setPageData({ feedId, feedItem });
  // };
  console.log(data);

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  return status === "error" ? (
    <div>
      <h1 className="text-2xl font-bold text-center">
        Error retrieving your feed
      </h1>
      <div className="mt-4 flex items-center justify-center">
        <a
          href="/"
          className="bg-sidebar hover:bg-sidebar-accent px-4 py-1 rounded-md"
        >
          Refresh your feed
        </a>
      </div>
    </div>
  ) : (
    <div className="container mx-auto pt-4 relative">
      {data?.pages?.map((page, pageIndex) => {
        return (
          <Fragment key={pageIndex}>
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
                        onClick={async () =>
                          await navigate({
                            to: "/subscriptions/$feedId/$feedItemId/$page",
                            params: {
                              feedId: feed.id,
                              feedItemId: feedItem.id.toString(),
                              page: pageIndex.toString(),
                            },
                            mask: {
                              to: "/subscriptions/$feedId",
                              params: { feedId: feed.id },
                              unmaskOnReload: false,
                            },
                          })
                        }
                      >
                        <FeedItemCard
                          // key={feedItem.id}
                          feedItem={feedItem}
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
      <div
        className={`${hasNextPage ? "" : "hidden"} absolute -bottom-[2rem] bg-transparent pointer-events-none left-[50%] -translate-x-[50%] after:content-[""] after:absolute pt-[10rem] after:bg-transparent`}
        ref={ref}
      >
        {hasNextPage ? (
          <div className="absolute left-0 bottom-0 size-6 rounded-full bg-transparent border-t-blue-500 border-[4px] animate-[spin_.8s_linear_infinite]"></div>
        ) : (
          "End"
        )}
      </div>
    </div>
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
