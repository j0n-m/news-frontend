import ErrorPage from "@/components/ErrorPage/Error";
import { SearchDeps } from "@/types/loaderSearch";
import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "../__root";
import { homeFeeds } from "@/queries/homeFeeds";
import IndexAuth from "@/pages/Home/IndexAuth";

export const Route = createFileRoute("/_protected/home")({
  component: RouteComponent,
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
  pendingComponent: () => {
    return <p className="font-bold text-2xl">home is loading</p>;
  },
});

function RouteComponent() {
  return <IndexAuth></IndexAuth>;
}
