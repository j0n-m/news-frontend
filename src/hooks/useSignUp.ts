import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";

export default function useSignUp() {
  const signUpMutate = useMutation({
    mutationKey: ["signup"],
    mutationFn: ({
      email,
      password,
      first_name,
      last_name,
    }: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) => {
      return fetch.post(
        "/api/users",
        {
          email,
          password,
          first_name,
          last_name,
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

  return { signUpMutate };
}
