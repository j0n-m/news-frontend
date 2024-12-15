import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useEffect, useState } from "react";
import { CatchBoundary, Link } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useAuth from "@/hooks/useAuth";
import errorIcon from "../../assets/images/error-icon.png";
import { Button } from "../ui/button";

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

function ErrorPage({ error }: ErrorPageProps) {
  const reason = getReason(error);
  const [showToast, setShowToast] = useState(true);
  // const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  // console.log("error page", "error", error, "reset", reset);

  useEffect(() => {
    // Reset the query error boundary
    if (user && error instanceof AxiosError && error?.status === 401) {
      setUser(null);
    }
    // console.log("error useeffect");
    queryErrorResetBoundary?.reset();
    // toasterRef?.current?.click();
    toast({
      open: showToast,
      duration: 1000 * 60,
      onOpenChange: (open) => setShowToast(open),
      variant: "destructive",
      title: "Uh oh! An error occured",
      description: `Reason: ${reason}`,
      action: (
        <ToastAction altText="Refresh" onClick={() => window.location.reload()}>
          Refresh
        </ToastAction>
      ),
    });
  }, []);

  return (
    <CatchBoundary
      onCatch={(error) => console.error("error ->", error)}
      getResetKey={() => "reset"}
    >
      <main className="grid min-h-full place-items-center bg-white px-6 py-20 sm:py-32 lg:px-8">
        <div className="text-center flex flex-col justify-center items-center">
          <img
            src={errorIcon}
            role="presentation"
            loading="eager"
            className="aspect-auto max-w-[200px]"
          />
          <h1 className="mt-2 text-balance text-5xl font-semibold tracking-tight">
            This is embarrassing...
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            {`Sorry, an unexpected error occured.`}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild variant={"secondary"}>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
        <p className="mb-40"></p>
      </main>
    </CatchBoundary>
  );
}
export default ErrorPage;
