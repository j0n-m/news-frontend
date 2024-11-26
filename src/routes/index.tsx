import { createFileRoute, redirect } from "@tanstack/react-router";
import ErrorPage from "@/components/ErrorPage/Error";
import Index from "@/pages/Home/Index";
import { isAuthenticated } from "@/utils/isAuthenticated";
export const Route = createFileRoute("/")({
  component: () => <Index />,
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset}></ErrorPage>;
  },
  beforeLoad: async ({ location }) => {
    const isAuth = await isAuthenticated();
    if (isAuth) {
      throw redirect({
        from: location.pathname,
        to: "/home",
        replace: true,
      });
    }
  },
});
