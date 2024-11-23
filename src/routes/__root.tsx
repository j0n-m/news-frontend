import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Suspense } from "react";

// const TanStackRouterDevtools =
//   process.env.NODE_ENV === "production"
//     ? () => null // Render nothing in production
//     : React.lazy(() =>
//         // Lazy load in development
//         import("@tanstack/router-devtools").then((res) => ({
//           default: res.TanStackRouterDevtools,
//           // For Embedded Mode
//           // default: res.TanStackRouterDevtoolsPanel
//         }))
//       );
const TanStackRouterDevtools = () => null;

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ScrollRestoration getKey={(location) => location.pathname} />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
  errorComponent: () => <p>Error</p>,
});
