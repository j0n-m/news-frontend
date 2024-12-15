import { FeedResponseSchema } from "@/types/feed";
import fetch from "@/utils/fetch";
import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";

export const homeFeeds = () => {
  return infiniteQueryOptions({
    queryKey: ["home"],
    queryFn: async ({ pageParam }: { pageParam: number | null }) => {
      const res = await fetch.get("/api/home?startIndex=" + pageParam, {
        withCredentials: true,
      });
      // console.log(res?.data);
      const feedSchemaRes = FeedResponseSchema.safeParse(res?.data);

      if (feedSchemaRes.success) {
        return feedSchemaRes.data;
      } else {
        // console.error("invalid feed format", res?.data, feedSchemaRes.error);
        console.error("invalid feed format");
        throw new Error("Invalid feed format");
      }
    },
    initialPageParam: 0,

    getNextPageParam: (lastPage) => lastPage!.nextStart,
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });
};
