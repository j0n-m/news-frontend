import SidebarContainer from "@/components/SidebarContainer/SidebarContainer";
import { SidebarProvider } from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import { authQueryOptions } from "@/queries/authQuery";
import { UserSchema } from "@/types/user";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      throw redirect({
        from: location.pathname,
        to: "/signin",
        search: { redirect: location.pathname },
        replace: true,
      });
    }
  },
});

function RouteComponent() {
  const { user, setUser } = useAuth();
  const [cookies] = useCookies(["sidebar:state"]);
  const userQuery = useSuspenseQuery(authQueryOptions());

  useEffect(() => {
    if (!user && userQuery.isSuccess) {
      setUser(UserSchema.parse(userQuery.data.data.user));
    }
  }, [userQuery.isSuccess]);
  // useEffect(() => {
  //   const error = userQuery.error;
  //   if (error && error instanceof AxiosError) {
  //     if (error.status === 401) {
  //       window.location.replace(`/signin?redirect=${location.pathname}`);
  //     }
  //   }
  // }, [userQuery.isError]);

  return (
    <SidebarProvider className="group" open={cookies["sidebar:state"]}>
      <SidebarContainer>
        <Outlet></Outlet>
      </SidebarContainer>
    </SidebarProvider>
  );
}
