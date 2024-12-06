import {
  GlobalFeedsByCategoryElementSchema,
  GlobalFeedsByCategoryResponse,
} from "@/types/feed";
import fetch from "@/utils/fetch";
import { queryOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const globalFeedsByCategoryQueryOptions = () => {
  return queryOptions({
    queryKey: ["globalFeedsByCategory"],
    queryFn: async () => {
      return (await fetch.get(
        "/api/feeds?sortBy=category"
      )) as AxiosResponse<GlobalFeedsByCategoryResponse>;
    },
    staleTime: Infinity,
    select: (res) => {
      const schemaRes = GlobalFeedsByCategoryElementSchema.parse(res.data);
      return schemaRes.feeds[0];
    },
  });
};

export default globalFeedsByCategoryQueryOptions;
