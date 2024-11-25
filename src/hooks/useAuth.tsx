import { UserAuthContext } from "@/context/userAuthContext";
import { queryClient } from "@/routes/__root";
import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useContext } from "react";

export default function useAuth() {
  const { user, setUser } = useContext(UserAuthContext);
  const router = useRouter();

  const signOutMutate = useMutation({
    mutationKey: ["signOut"],
    mutationFn: async () => {
      return await fetch.post("/auth/logout", {}, { withCredentials: true });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const signOut = () => {
    if (signOutMutate.isPending) {
      return;
    }
    signOutMutate.mutate(undefined, {
      onSuccess: async () => {
        const runAfterSignOut = async () => {
          setUser(null);
          queryClient.clear();
          await router.navigate({ to: "/" });
          await router.invalidate();
          // await navigate({ to: "/", replace: true });
        };
        runAfterSignOut();
      },
    });
  };

  return { user, setUser, signOut };
}
