import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

function NotFoundPage() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-4xl font-semibold">404</p>
        <h1 className="mt-2 text-balance text-5xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          {`Sorry, we couldn't find the page you're looking for.`}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild variant={"secondary"}>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
      <p className="mb-40"></p>
    </main>
  );
}
export default NotFoundPage;
