import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/subscriptions/$feedId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { feedId } = useParams({ from: "/_protected/subscriptions/$feedId" });

  return <p>'Hello /_protected/subscriptions/$feedId!' with id: ${feedId}</p>;
}
