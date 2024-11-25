import { useToast } from "@/hooks/use-toast";
import Index from "@/pages/Home/Index";
import { ToastAction } from "../ui/toast";
import { useEffect, useRef, useState } from "react";
import { CatchBoundary } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useAuth from "@/hooks/useAuth";

type ErrorPageProps = {
  error: Error;
  reset?: () => void;
};
function getReason(error: Error) {
  let reason: string;
  if (error instanceof AxiosError) {
    reason =
      error?.status === 401 ? "Unauthorized, Please log in." : error?.message;
  } else if (error instanceof Error) {
    reason = error?.message;
  } else {
    reason = "An unexpected error occured";
  }

  return reason;
}

function ErrorPage({ error, reset }: ErrorPageProps) {
  const reason = getReason(error);
  const [showToast, setShowToast] = useState(true);
  // const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const toasterRef = useRef<HTMLButtonElement>(null);

  console.log("error page", "error", error, "reset", reset);

  useEffect(() => {
    // Reset the query error boundary
    if (user && error instanceof AxiosError && error?.status === 401) {
      setUser(null);
      // if (reset) {
      //   reset();
      // }
    }
    console.log("error useeffect");
    queryErrorResetBoundary?.reset();
    toasterRef?.current?.click();
    // if (reset) {
    //   reset();
    // }
    // queryClient.clear();
  }, []);

  return (
    <CatchBoundary
      onCatch={(error) => console.error("error in catchBoundary ->", error)}
      getResetKey={() => "reset"}
    >
      <div className="flex gap-4 justify-center items-center">
        <h1 className="text-2xl font-bold text-center">An error occured</h1>
        <button onClick={() => window.location.reload()}>Refresh</button>
        <button onClick={() => reset && reset()}>reset</button>
        <button
          ref={toasterRef}
          onClick={() => {
            toast({
              open: showToast,
              duration: 1000 * 60 * 60,
              onOpenChange: (open) => setShowToast(open),
              variant: "destructive",
              title: (
                <span className="font-bold text-lg">
                  Uh oh! An error occured
                </span>
              ),
              description: `Reason: ${reason}`,
              action: (
                <ToastAction
                  altText="Refresh"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </ToastAction>
              ),
            });
          }}
        ></button>
      </div>

      <Index></Index>
    </CatchBoundary>
  );
}
export default ErrorPage;
