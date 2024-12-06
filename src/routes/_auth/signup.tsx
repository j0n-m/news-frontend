import SignUpPage from "@/pages/Auth/SignUpPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signup")({
  component: () => <SignUpPage />,
});
