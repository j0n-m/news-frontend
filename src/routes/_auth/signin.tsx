import SignInPage from "@/pages/Auth/SignInPage";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signin")({
  component: () => <SignInPage />,
  beforeLoad: async () => {
    const isAuth = await isAuthenticated();
    if (isAuth) {
      throw redirect({ to: "/home" });
    }
  },
});
