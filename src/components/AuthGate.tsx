import { Navigate } from "@tanstack/react-router";
import Index from "../pages/Home/Index";
import SidebarContainer from "./SidebarContainer/SidebarContainer";

type AuthGateProps = {
  children: React.ReactNode;
  dataStatus?: number;
};

function AuthGate({ children, dataStatus }: AuthGateProps) {
  if (dataStatus === 401) {
    return <Index />;
  } else if (dataStatus === 304) {
    return <Navigate to="/signin"></Navigate>;
  } else {
    return <SidebarContainer>{children}</SidebarContainer>;
  }
}

export default AuthGate;
