import { Link } from "@tanstack/react-router";

function Nav() {
  return (
    <nav className="p-4 border">
      <ul className="flex items-center justify-end gap-5">
        <li>
          <Link to="/">News RSS</Link>
        </li>
        <li className="ml-auto">
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/signin">Sign In</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
