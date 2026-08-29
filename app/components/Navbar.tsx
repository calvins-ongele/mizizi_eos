import { cookies } from "next/headers";
import { LogoutButton } from "../dashboard/components/Logout";
import { getCurrentUser } from "../lib/getCurrentUser";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <div>
      {user ? (
        <div></div>
      ) : (
        <header className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
            <a href="/" className="font-semibold">
              MyApp
            </a>
            <nav className="space-x-4 text-sm">
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </nav>
          </div>
        </header>
      )}
    </div>
  );
}
