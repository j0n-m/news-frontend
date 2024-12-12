import fetch from "@/utils/fetch";
import { queryOptions } from "@tanstack/react-query";

const UserSavedArticlesOptions = (userId: string) =>
  queryOptions({
    queryKey: ["userSavedArticles"],
    queryFn: async () =>
      await fetch.get(`/api/user/${userId}/saved-feed-items`),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

export default UserSavedArticlesOptions;
