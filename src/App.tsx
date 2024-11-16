import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { FeedItemDataContextProvider } from "./context/feedItemData";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FeedItemDataContextProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </FeedItemDataContextProvider>
    </QueryClientProvider>
  );
}

export default App;
