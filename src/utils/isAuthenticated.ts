import { queryClient } from "@/routes/__root";
import { authQueryOptions } from "@/queries/authQuery";

export async function isAuthenticated() {
  try {
    const res = await queryClient.fetchQuery(authQueryOptions());
    const { isAuth } = res.data;
    return isAuth;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // console.error("isauthenticated", e);
    return false;
  }
}
