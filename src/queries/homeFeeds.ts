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
      const feedSchemaRes = FeedResponseSchema.safeParse(res?.data);
      if (feedSchemaRes.success) {
        console.log("feedSchemaRes.data", feedSchemaRes.data);
        return feedSchemaRes.data;
      } else {
        console.error("invalid feed format");
        throw new Error("Invalid feed format");
      }
    },
    initialPageParam: 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getNextPageParam: (lastPage, pages) => lastPage!.nextStart,
    // throwOnError: true,
    staleTime: 1000 * 60 * 3,
    placeholderData: keepPreviousData,
  });
};
