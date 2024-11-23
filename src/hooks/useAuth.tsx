import { queryClient } from "@/App";
import { UserAuthContext } from "@/context/userAuthContext";
import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect } from "react";

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
    signOutMutate.mutate();
  };

  useEffect(() => {
    const runAfterSignOut = async () => {
      setUser(null);
      queryClient.clear();
      await router.navigate({ to: "/" });
      await router.invalidate();
      // await navigate({ to: "/", replace: true });
    };
    if (signOutMutate.isSuccess) {
      runAfterSignOut();
    }
  }, [signOutMutate.isSuccess]);

  return { user, setUser, signOut };
}
