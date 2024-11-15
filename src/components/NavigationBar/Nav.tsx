import { Link } from "@tanstack/react-router";

function Nav() {
  return (
    <nav className="p-4 border">
      <ul className="flex items-center justify-end gap-5">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>Login</li>
      </ul>
    </nav>
  );
}

export default Nav;
