import { createFileRoute } from "@tanstack/react-router";
import AddFeedPage from "@/pages/Add-Feed/AddFeedPage";
import { queryClient } from "@/routes/__root";
import globalFeedsInfinite from "@/queries/globalFeedsInfinite";
// import categoriesQuery from "@/queries/categoriesQuery";
import globalFeedsByCategoryQueryOptions from "@/queries/globalFeedsByCategoryQueryOptions";

export const Route = createFileRoute("/_protected/subscribe/feeds")({
  component: RouteComponent,
  loader: async () => {
    // await queryClient.ensureQueryData(categoriesQuery());
    await queryClient.ensureQueryData(globalFeedsByCategoryQueryOptions());
    return await queryClient.ensureInfiniteQueryData(globalFeedsInfinite());
  },
});

function RouteComponent() {
  return <AddFeedPage />;
}
