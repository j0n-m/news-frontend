import { User } from "@/types/user";
import fetch from "@/utils/fetch";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const singleFeedQueryOptions = (feedId: string, user: User | null) => {
  return queryOptions({
    queryKey: ["singleFeed", feedId],
    queryFn: async () =>
      await fetch.get(`/api/user/${user?.id || ""}/feed/${feedId}?show=true`, {
        withCredentials: true,
      }),
    enabled: !!user,
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });
};
