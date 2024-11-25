import App from "@/App";
import ErrorPage from "@/components/ErrorPage/Error";
import { FeedItemDataContextProvider } from "@/context/feedItemData";
import { UserAuthProvider } from "@/context/userAuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CatchBoundary, createRootRoute } from "@tanstack/react-router";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "@/components/ui/toaster";

export const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <CatchBoundary
      getResetKey={() => "reset"}
      errorComponent={({ error, reset }) => (
        <ErrorPage error={error} reset={reset} />
      )}
    >
      <QueryClientProvider client={queryClient}>
        <UserAuthProvider>
          <FeedItemDataContextProvider>
            <CookiesProvider defaultSetOptions={{ path: "/" }}>
              <App />
              <Toaster></Toaster>
              <ReactQueryDevtools initialIsOpen={false} />
            </CookiesProvider>
          </FeedItemDataContextProvider>
        </UserAuthProvider>
      </QueryClientProvider>
    </CatchBoundary>
  ),
});
