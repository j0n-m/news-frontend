import fetch from "@/utils/fetch";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const signInMutate = useMutation({
    mutationKey: ["signin"],
    mutationFn: () => {
      return fetch.post(
        "/auth/login",
        {
          email: "test@email.com",
          password: "mytestpass",
        },
        { withCredentials: true }
      );
    },
    onSuccess: async () => {
      // await fetchAndUpdateUser();
    },
  });
  const handleSignIn = () => {
    signInMutate.mutate(undefined, {
      onSuccess: async () => {
        const redirect = new URLSearchParams(window.location.search).get(
          "redirect"
        );
        // await navigate({ to: `${redirect || "/"}`, replace: true });
        window.location.replace(redirect || "/home");
      },
    });
  };
  return (
    <>
      <div>
        <button onClick={handleSignIn}>sign in as test user</button>
      </div>
    </>
  );
}
