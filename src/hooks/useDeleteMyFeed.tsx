import { queryClient } from "@/routes/__root";
import { User } from "@/types/user";
import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";

export function useDeleteMyFeed(user: User | null) {
  const myFeedMutate = useMutation({
    mutationKey: ["delete-my-feed", user?.id],
    mutationFn: async ({ feedId }: { feedId: string }) =>
      await fetch.delete(`/api/user/${user?.id}/feed/${feedId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myFeeds"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return myFeedMutate;
}
