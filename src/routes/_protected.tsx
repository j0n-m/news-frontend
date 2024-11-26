import SidebarContainer from "@/components/SidebarContainer/SidebarContainer";
import { SidebarProvider } from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import { UserSchema } from "@/types/user";
import fetch from "@/utils/fetch";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { useQuery } from "@tanstack/react-query";
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
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => await fetch.get("/auth", { withCredentials: true }),
    retry: (failureCount) => failureCount < 1,
  });

  useEffect(() => {
    if (!user && userQuery.isSuccess) {
      setUser(UserSchema.parse(userQuery.data.data.user));
    }
  }, [userQuery.isSuccess]);
  return (
    <SidebarProvider className="group" open={cookies["sidebar:state"]}>
      <SidebarContainer>
        <Outlet></Outlet>
      </SidebarContainer>
    </SidebarProvider>
  );
}
