import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/subscriptions/favorites")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /_protected/subscriptions/favorites!";
}
