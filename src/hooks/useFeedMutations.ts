import { queryClient } from "@/routes/__root";
import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";

export default function useFeedMutations() {
  const createFeedMutation = useMutation({
    mutationKey: ["create-feed"],
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: { url: string; title: string; category: string[] };
    }) => {
      return await fetch.post(`/api/user/${userId}/feeds`, payload);
    },
    onSuccess: async () => {
      console.log("created feed!");
      await queryClient.invalidateQueries({ queryKey: ["myFeeds"] });
    },
    onError: (error) => {
      throw error;
    },
  });

  return { createFeedMutation };
}
