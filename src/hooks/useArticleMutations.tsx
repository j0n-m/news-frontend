import { queryClient } from "@/routes/__root";
import { FeedItem } from "@/types/feed";
import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";

function useArticleMutations() {
  const saveArticleMutate = useMutation({
    mutationKey: ["saveArticle"],
    mutationFn: async ({
      data,
      userId,
      feedId,
      feedTitle,
    }: {
      data: FeedItem;
      userId: string;
      feedId: string;
      feedTitle: string;
    }) =>
      await fetch.post(`/api/user/${userId}/saved-feed-items`, {
        data: data,
        owner: userId,
        fallback_feed_title: feedTitle,
        feed: feedId ? feedId : undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userSavedArticle"] });
      await queryClient.invalidateQueries({ queryKey: ["userSavedArticles"] });
      await queryClient.invalidateQueries({ queryKey: ["home"] });
      queryClient.invalidateQueries({
        queryKey: ["singleFeed"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const removeArticleMutate = useMutation({
    mutationKey: ["removeArticle"],
    mutationFn: async ({
      userId,
      feedItemId,
    }: {
      userId: string;
      feedItemId: string;
    }) =>
      await fetch.delete(`/api/user/${userId}/saved-feed-item/${feedItemId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userSavedArticle"] });
      await queryClient.invalidateQueries({ queryKey: ["userSavedArticles"] });
      await queryClient.invalidateQueries({ queryKey: ["home"] });
      queryClient.invalidateQueries({
        queryKey: ["singleFeed"],
      });
      //in /favorites an error would occur (out of arr index error) if removed from there and updated
      // await queryClient.invalidateQueries({ queryKey: ["userSavedArticles"] });
      console.log("article removed!");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { saveArticleMutate, removeArticleMutate };
}

export default useArticleMutations;
