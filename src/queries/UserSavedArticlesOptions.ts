import fetch from "@/utils/fetch";
import { queryOptions } from "@tanstack/react-query";

const UserSavedArticlesOptions = (userId: string) =>
  queryOptions({
    queryKey: ["userSavedArticles"],
    queryFn: async () =>
      await fetch.get(`/api/user/${userId}/saved-feed-items`),
    enabled: !!userId,
    staleTime: Infinity,
  });

export default UserSavedArticlesOptions;
