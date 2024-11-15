import { createFileRoute } from "@tanstack/react-router";
import IndexAuth from "../pages/Home/IndexAuth";
import Index from "../pages/Home/Index";
import { queryOptions } from "@tanstack/react-query";
import fetch from "../utils/fetch";
import { queryClient } from "../App";

export type SearchDeps = {
  nextIndex?: number;
  limit?: number;
  skip?: number;
};

export function getHomeFeed(searchDeps: SearchDeps = {}) {
  console.log("search deps", searchDeps);
  return queryOptions({
    queryKey: ["home", searchDeps],
    queryFn: () => {
      return fetch.get(
        `/api/home?${searchDeps.limit ? `limit=${searchDeps.limit}` : "?limit=1"}${searchDeps.nextIndex ? `startIndex=${searchDeps.nextIndex}` : ""}`
      );
    },
    staleTime: 1000 * 60 * 5,
  });
}
export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchDeps => {
    return {
      skip: Number(search.skip) || undefined,
      limit: Number(search.limit) || undefined,
    };
  },
  loaderDeps: ({ search: { skip, limit, nextIndex } }) => {
    return { skip, limit, nextIndex };
  },
  beforeLoad: async () => {
    //check auth
  },
  loader: async ({ deps }) => {
    // await queryClient.ensureQueryData(getHomeFeed(deps));
  },
});

function RouteComponent() {
  //access tanstack query cache, and use if-then for which component to load
  //when auth fails/succeeds
  const isAuth = true;
  if (isAuth) {
    return <IndexAuth />;
  }
  return <Index />;
}
