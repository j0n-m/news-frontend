import SignInPage from "@/pages/Auth/SignInPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signin")({
  component: () => <SignInPage />,
});
