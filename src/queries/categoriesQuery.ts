import { Categories } from "@/types/categories";
import fetch from "@/utils/fetch";
import { queryOptions } from "@tanstack/react-query";

const categoriesQuery = () => {
  return queryOptions({
    queryKey: ["categories"],
    queryFn: async () => await fetch.get("/api/categories"),
    staleTime: Infinity,
    select: (res) => res.data as Categories,
  });
};

export default categoriesQuery;
