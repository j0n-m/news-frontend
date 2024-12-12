import Nav from "@/components/NavigationBar/Nav";
import NotFoundPage from "@/pages/404/NotFoundPage";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  notFoundComponent: () => <NotFoundPage />,
});

function RouteComponent() {
  return (
    <>
      <Nav />
      <div className="pt-8">
        <Outlet />
      </div>
    </>
  );
}
