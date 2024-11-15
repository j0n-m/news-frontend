import { Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FeedResponseSchema } from "../../types/feed";
import { useInView } from "react-intersection-observer";
import FeedItemCard from "../../components/FeedItemCard/FeedItemCard";
import { Fragment, useEffect } from "react";
import fetch from "../../utils/fetch";

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
  const { ref, inView } = useInView();
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
    <div className="max-w-[1100px] mx-auto h-full border grid grid-cols-[1fr] md:grid-cols-[90px,auto] lg:grid-cols-[250px,auto]">
      <aside className="z-40 bg-white border fixed flex bottom-0 left-0 right-0 md:sticky md:flex-col md:top-0 md:left-0 md:bottom-0 lg:p-4">
        <div className="logo-section hidden md:block mb-4">
          <div className="text-xl font-bold">News Today</div>
        </div>
        <nav className="grid grid-cols-5 gap-2 md:grid-cols-1 place-items-center md:place-items-stretch md:w-full">
          <div>
            <Link to="/" className="border w-full block py-1 text-lg">
              Home
            </Link>
          </div>
          <div>
            <Link to="/" className="border w-full block py-1 text-lg">
              Profile
            </Link>
          </div>
        </nav>
      </aside>
      <main className="border p-4">
        <div className="main-container">
          {data?.pages?.map((page, i) => {
            return (
              <Fragment key={i}>
                {page?.data?.map((feed, index) => {
                  return (
                    <div key={index} className="mb-8 border-b">
                      <div>
                        <h1 className="font-bold text-xl">{feed.feed_title}</h1>
                      </div>
                      {feed.items.map((feedItem) => (
                        <FeedItemCard key={feedItem.id} feedItem={feedItem} />
                      ))}
                    </div>
                  );
                })}
              </Fragment>
            );
          })}
          {/* <div className="flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage}
              className="px-6 bg-green-300 disabled:bg-gray-400"
            >
              {hasNextPage ? "Next" : "No more pages"}
            </button>
          </div> */}
          <div ref={ref}>
            {hasNextPage ? "fetching more..." : "No more to fetch"}
          </div>
        </div>
      </main>
    </div>
  );
}

export default IndexAuth;
