import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import fetch from "../../utils/fetch";

export const Route = createFileRoute("/signin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const handleSignIn = () => {
    fetch
      .post(
        "/auth/login",
        {
          email: "test@email.com",
          password: "mytestpass",
        },
        { withCredentials: true }
      )
      .then(() => {
        navigate({ to: "/", replace: true });
      });
  };
  return (
    <>
      <div>
        <button onClick={handleSignIn}>sign in as test user</button>
      </div>
    </>
  );
}
