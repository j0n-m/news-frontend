import fetch from "@/utils/fetch";
import { queryOptions } from "@tanstack/react-query";

const authQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: async () => await fetch.get("/auth/", { withCredentials: true }),
    retry: false,
    staleTime: 1000 * 5,
    throwOnError: true,
  });

export { authQueryOptions };
