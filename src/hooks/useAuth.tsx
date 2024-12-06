import { UserAuthContext } from "@/context/userAuthContext";
import { queryClient } from "@/routes/__root";
import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export default function useAuth() {
  const { user, setUser } = useContext(UserAuthContext);

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
          window.location.replace("/");
        };
        runAfterSignOut();
      },
    });
  };

  return { user, setUser, signOut };
}
