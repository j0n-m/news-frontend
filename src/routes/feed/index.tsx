import { createFileRoute } from "@tanstack/react-router";
import FeedItemPage from "../../pages/Feed/FeedItemPage";

export const Route = createFileRoute("/feed/")({
  component: () => <FeedItemPage />,
});
