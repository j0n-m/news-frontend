import { queryClient } from "@/routes/__root";
import fetch from "./fetch";

export async function isAuthenticated() {
  try {
    const res = await fetch.get("/auth/", {
      withCredentials: true,
    });
    const { isAuth, user } = res.data;
    // console.log("isauthenticated", res, isAuth);
    queryClient.setQueryData(["auth"], user);
    return isAuth;
  } catch (e) {
    console.error("isauthenticated", e);
    return false;
  }
}
