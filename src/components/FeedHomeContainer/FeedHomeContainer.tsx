import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";

type FeedHomeContainer = {
  children?: ReactNode;
};
function FeedHomeContainer({ children }: FeedHomeContainer) {
  return (
    <div className="feed-home-container max-w-[1100px] relative mx-auto h-full border grid grid-cols-[1fr] md:grid-cols-[90px,auto] lg:grid-cols-[250px,auto]">
      <aside className="z-20 bg-white border-t md:border-none fixed flex bottom-0 left-0 right-0 md:sticky md:flex-col md:top-0 md:left-0 md:bottom-0">
        <div className="sticky top-0 left-0 right-0 bg-white px-1 py-3 lg:p-4">
          <div className="logo-section hidden md:block mb-4">
            <div className="text-xl font-bold">News Today</div>
          </div>
          <nav className="grid grid-cols-5 gap-2 md:grid-cols-1 place-items-center md:place-items-stretch md:w-full">
            <div>
              <Link to="/" className="border w-full block py-1 text-lg">
                Home
              </Link>
            </div>
            <div>
              <Link to="/" className="border w-full block py-1 text-lg">
                Profile
              </Link>
            </div>
          </nav>
        </div>
      </aside>
      <main className="border px-4">
        <div className="main-container">{children}</div>
      </main>
    </div>
  );
}

export default FeedHomeContainer;
