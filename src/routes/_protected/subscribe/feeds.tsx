import { createFileRoute } from "@tanstack/react-router";
import AddFeedPage from "@/pages/Add-Feed/AddFeedPage";

export const Route = createFileRoute("/_protected/subscribe/feeds")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddFeedPage />;
}
