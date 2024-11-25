import {
  CatchBoundary,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import React, { Suspense, useEffect } from "react";
import useAuth from "./hooks/useAuth";
import SidebarContainer from "./components/SidebarContainer/SidebarContainer";
import ErrorPage from "./components/ErrorPage/Error";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );
// const TanStackRouterDevtools = () => null;

function App() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("app", user);
  }, [user]);

  return (
    <CatchBoundary
      getResetKey={() => "reset"}
      errorComponent={({ error, reset }) => (
        <ErrorPage error={error} reset={reset} />
      )}
    >
      {user ? (
        <SidebarContainer>
          <Outlet></Outlet>
        </SidebarContainer>
      ) : (
        <Outlet></Outlet>
      )}

      <ScrollRestoration getKey={(location) => location.pathname} />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </CatchBoundary>
  );
}

export default App;
