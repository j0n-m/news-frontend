import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

type RouteComponentProps = {
  label: string;
};
function RouteComponent({ label }: RouteComponentProps) {
  return (
    <>
      <h1>Test Route</h1>
      <p>{label}</p>
    </>
  );
}
