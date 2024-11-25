import { Navigate, useRouter } from "@tanstack/react-router";
import Index from "../pages/Home/Index";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import fetch from "@/utils/fetch";
import { UserSchema } from "@/types/user";
import { useEffect } from "react";

type AuthGateProps = {
  children: React.ReactNode;
  dataStatus?: number;
};

function AuthGate({ children, dataStatus }: AuthGateProps) {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return fetch.get(`/auth/`, { withCredentials: true });
    },
    retry: (failureCount) => {
      if (failureCount > 0) {
        return false;
      }
      return true;
    },
  });

  useEffect(() => {
    if (userQuery.isSuccess && !user) {
      const validate = UserSchema.parse(userQuery?.data?.data?.user);
      console.log("setting user", validate);
      setUser(validate);
    }
  }, [userQuery.data]);

  if (userQuery.isPending && dataStatus !== 401) {
    return <p>skeleton loading</p>;
  }

  // if (user && dataStatus === 401) {
  //   console.log(
  //     "authGate -> setting user to null",
  //     "authGate user id:",
  //     user?.id,
  //     "authGate dataStatus",
  //     dataStatus
  //   );
  //   setUser(null);
  // }

  if (dataStatus === 401) {
    return <Index />;
  } else if (dataStatus === 304) {
    // return <Navigate to="/signin"></Navigate>;
    router.history.push("/signin");
  } else {
    // return null;
    // return <SidebarContainer>{children}</SidebarContainer>;
    return <>{children}</>;
  }
}

export default AuthGate;
