import { createFileRoute } from "@tanstack/react-router";
import AuthGate from "@/components/AuthGate";
import { queryClient } from "@/routes/__root";
import { queryOptions } from "@tanstack/react-query";
import fetch from "@/utils/fetch";
import { AxiosError } from "axios";
import AddFeedPage from "@/pages/Add-Feed/AddFeedPage";
import ErrorPage from "@/components/ErrorPage/Error";

export function verifyAuth() {
  return queryOptions({
    queryKey: ["auth"],
    queryFn: async () => await fetch.get("/auth/", { withCredentials: true }),
  });
}
export const Route = createFileRoute("/create/feeds")({
  component: RouteComponent,
  loader: async () => {
    try {
      const res = await queryClient.ensureQueryData(verifyAuth());
      return res;
    } catch (error) {
      console.log("error occured");
      if ((error as AxiosError)?.status === 401) {
        return { isUnauthorized: true, status: 304 };
      }
      throw error;
    }
  },
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset}></ErrorPage>;
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <AuthGate dataStatus={data.status}>
      <AddFeedPage />
    </AuthGate>
  );
}
