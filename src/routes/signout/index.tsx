import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import fetch from "../../utils/fetch";
import { queryClient } from "../../App";

export const Route = createFileRoute("/signout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  //usemutation instead to get states and disable button/function
  const handleSignout = async () => {
    console.log("signout handler");
    await fetch.post("/auth/logout", {}, { withCredentials: true });
    await navigate({ to: "/", replace: true });
    window.location.reload();
  };
  return (
    <div>
      <button onClick={handleSignout}>sign out</button>
    </div>
  );
}
