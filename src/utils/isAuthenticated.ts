import fetch from "./fetch";

export async function isAuthenticated() {
  try {
    const res = await fetch.get("/auth/", {
      withCredentials: true,
    });
    const { isAuth } = res.data;
    // console.log("isauthenticated", res, isAuth);
    return isAuth;
  } catch (e) {
    console.error("isauthenticated", e);
    return false;
  }
}
