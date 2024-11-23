import { createFileRoute } from "@tanstack/react-router";
import AuthGate from "@/components/AuthGate";
import { queryClient } from "@/App";
import { queryOptions } from "@tanstack/react-query";
import fetch from "@/utils/fetch";
import { AxiosError } from "axios";

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
  errorComponent: () => <div>custom error component</div>,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <AuthGate dataStatus={data.status}>
      <p>ADD A FEED</p>
    </AuthGate>
  );
}
