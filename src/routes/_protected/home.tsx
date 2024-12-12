import ErrorPage from "@/components/ErrorPage/Error";
import { SearchDeps } from "@/types/loaderSearch";
import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "../__root";
import { homeFeeds } from "@/queries/homeFeeds";
import IndexAuth from "@/pages/Home/IndexAuth";
import FeedItemCardSkeleton from "@/components/Loading/FeedItemCardSkeleton";
import NotFoundPage from "@/pages/404/NotFoundPage";

export const Route = createFileRoute("/_protected/home")({
  component: () => <IndexAuth />,
  validateSearch: (search: Record<string, unknown>): SearchDeps => {
    return {
      skip: Number(search.skip) || undefined,
      limit: Number(search.limit) || undefined,
    };
  },
  loaderDeps: ({ search: { skip, limit, nextIndex, redirect } }) => {
    return { skip, limit, nextIndex, redirect };
  },

  loader: async () => {
    return await queryClient.ensureInfiniteQueryData(homeFeeds());
  },
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset}></ErrorPage>;
  },
  notFoundComponent: () => <NotFoundPage />,
  pendingComponent: () => (
    <div className="flex flex-col max-w-[1000px] mx-auto gap-4 ">
      {Array.from({ length: 10 }).map((_, i) => (
        <FeedItemCardSkeleton key={i} />
      ))}
    </div>
  ),
});
