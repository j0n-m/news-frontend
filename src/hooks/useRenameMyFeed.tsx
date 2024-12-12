import { User } from "@/types/user";
import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";

export default function useRenameMyFeed() {
  const renameMutate = useMutation({
    mutationKey: ["renameFeed"],
    mutationFn: async ({
      user,
      feedId,
      newFeedTitle,
    }: {
      user: User;
      feedId: string;
      newFeedTitle: string;
    }) => {
      return await fetch.put(`/api/user/${user.id}/feed/${feedId}`, {
        title: newFeedTitle,
      });
    },
    onError: (e) => {
      console.error(e);
      throw e;
    },
  });
  return renameMutate;
}
