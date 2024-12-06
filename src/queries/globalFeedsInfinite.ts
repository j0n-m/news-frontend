import { GlobalFeedsResponse, GlobalFeedsResponseSchema } from "@/types/feed";
import fetch from "@/utils/fetch";
import { InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";

const globalFeedsInfinite = () =>
  infiniteQueryOptions({
    queryKey: ["globalFeeds"],
    queryFn: async ({ pageParam }: { pageParam: number | null }) => {
      const res = await fetch.get("/api/feeds?limit=40&skip=" + pageParam, {
        withCredentials: true,
      });
      // console.log("home feed before parse", res.data);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.feeds_info[0].next,
    initialPageParam: 0,
    staleTime: Infinity,
    select: (res: InfiniteData<GlobalFeedsResponse>) => {
      res.pages.map((p) => {
        const schemaRes = GlobalFeedsResponseSchema.parse(p);
        return schemaRes;
      });
      return res;
    },
  });
export default globalFeedsInfinite;
