import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";

/*
{
          email: "test@email.com",
          password: "mytestpass",
        },
*/
export default function useSignIn() {
  const signInMutate = useMutation({
    mutationKey: ["signin"],
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return fetch.post(
        "/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
    },
    onSuccess: async () => {
      // await fetchAndUpdateUser();
    },
    onError: (e) => {
      throw e;
    },
  });

  return { signInMutate };
}
