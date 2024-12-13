import ErrorPage from "@/components/ErrorPage/Error";
import SidebarContainer from "@/components/SidebarContainer/SidebarContainer";
import { SidebarProvider } from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import NotFoundPage from "@/pages/404/NotFoundPage";
import { authQueryOptions } from "@/queries/authQuery";
import { UserSchema } from "@/types/user";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && userQuery.isSuccess) {
      setUser(UserSchema.parse(userQuery.data.data.user));
    }
    if (userQuery.status === "error") {
      navigate({ to: "/signin", search: { redirect: location.pathname } });
    }
  }, [userQuery.isSuccess, userQuery.status]);

  return (
    <SidebarProvider className="group" open={cookies["sidebar:state"]}>
      <SidebarContainer>
        <Outlet></Outlet>
      </SidebarContainer>
    </SidebarProvider>
  );
}
