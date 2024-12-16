import useScrollPosition from "@/hooks/useScrollPosition";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { RssIcon } from "lucide-react";

function Nav() {
  const scrollPosition = useScrollPosition();
  return (
    <nav
      className={`sticky top-0 px-4 py-3 z-10 ${scrollPosition > 0 ? "shadow-md bg-white" : "bg-transparent"} transition-all duration-500`}
    >
      <ul className="flex items-center justify-end gap-6">
        <li>
          <Link to="/" className="font-bold text-lg flex gap-1">
            <RssIcon />
            <span>News RSS</span>
          </Link>
        </li>
        <li className="ml-auto">
          <Link to="/signin" className="hover:opacity-75">
            Sign In
          </Link>
        </li>
        <li>
          <Button variant={"blue"} asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
