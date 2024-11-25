import { createFileRoute } from "@tanstack/react-router";
import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import fetch from "../utils/fetch";
import { FeedResponseSchema } from "../types/feed";
import { queryClient } from "../routes/__root";
import AuthGate from "../components/AuthGate";
import { AxiosError } from "axios";
import IndexAuth from "@/pages/Home/IndexAuth";
import ErrorPage from "@/components/ErrorPage/Error";

export type SearchDeps = {
  nextIndex?: number;
  limit?: number;
  skip?: number;
  n?: string;
  redirect?: string;
};

export const getHomeFeed = () => {
  return infiniteQueryOptions({
    queryKey: ["home"],
    queryFn: async ({ pageParam }: { pageParam: number | null }) => {
      const res = await fetch.get("/api/home?startIndex=" + pageParam, {
        withCredentials: true,
      });
      const feedSchemaRes = FeedResponseSchema.safeParse(res?.data);
      if (feedSchemaRes.success) {
        console.log("feedSchemaRes.data", feedSchemaRes.data);
        return feedSchemaRes.data;
      } else {
        console.error("invalid feed format");
        throw new Error("Invalid feed format");
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage!.nextStart,
    // throwOnError: true,
    placeholderData: keepPreviousData,
  });
};
export const Route = createFileRoute("/")({
  component: TempRoute,
  // component: TempRoute,
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
    try {
      const res = await queryClient.ensureInfiniteQueryData(getHomeFeed());
      return res;
    } catch (error) {
      console.log("index route - error occured, determining status code");
      if ((error as AxiosError)?.status === 401) {
        return { isUnauthorized: true, status: 401 };
      }
      throw error;
    }
  },
  pendingComponent: () => {
    return <div>loading component...</div>;
  },
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset}></ErrorPage>;
  },
});
function TempRoute() {
  const data = Route.useLoaderData();
  type dataType = typeof data;

  return (
    <AuthGate dataStatus={(data as dataType & { status?: number })?.status}>
      <IndexAuth />
    </AuthGate>
  );
}
