import fetch from "@/utils/fetch";
import { queryOptions } from "@tanstack/react-query";

const authQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: async () => await fetch.get("/auth/", { withCredentials: true }),
    retry: (failureCount) => failureCount < 1,
    staleTime: 1000 * 5,
  });

export { authQueryOptions };
