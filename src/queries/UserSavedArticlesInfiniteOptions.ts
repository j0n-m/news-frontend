import { SavedFeed, SavedFeedSchema } from "@/types/feed";
import fetch from "@/utils/fetch";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const UserSavedArticlesInfiniteOptions = (userId: string, query?: string) =>
  infiniteQueryOptions({
    queryKey: ["userSavedArticles", { q: query }],
    queryFn: async ({ pageParam }: { pageParam: number | null }) => {
      const res = (await fetch.get(
        `/api/user/${userId}/saved-feed-items?sort=-date_added&${query ? `q=${query}` : ""}&limit=30&skip=` +
          pageParam,
        {
          withCredentials: true,
        }
      )) as AxiosResponse<SavedFeed>;
      const schemaRes = SavedFeedSchema.parse(res.data);
      return schemaRes;
    },
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage) => lastPage?.saved_items_info[0]?.next,
    initialPageParam: 0,
    enabled: !!userId,
  });

export default UserSavedArticlesInfiniteOptions;
