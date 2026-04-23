import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, FilmIcon, HomeIcon, UsersIcon, User } from "lucide-react";

const MobileNav = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  // Hide mobile nav on certain pages
  if (currentPath?.startsWith("/call")) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 z-40 h-16 flex items-center justify-around px-2 safe-area-inset-bottom">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
          currentPath === "/" ? "bg-primary text-primary-content" : "text-base-content opacity-70 hover:opacity-100"
        }`}
        title="Home"
      >
        <HomeIcon className="size-6" />
        <span className="text-xs font-medium">Home</span>
      </Link>

      <Link
        to="/friends"
        className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
          currentPath === "/friends" ? "bg-primary text-primary-content" : "text-base-content opacity-70 hover:opacity-100"
        }`}
        title="Friends"
      >
        <UsersIcon className="size-6" />
        <span className="text-xs font-medium">Friends</span>
      </Link>

      <Link
        to="/reels"
        className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
          currentPath === "/reels" ? "bg-primary text-primary-content" : "text-base-content opacity-70 hover:opacity-100"
        }`}
        title="Reels"
      >
        <FilmIcon className="size-6" />
        <span className="text-xs font-medium">Reels</span>
      </Link>

      <Link
        to="/notifications"
        className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
          currentPath === "/notifications" ? "bg-primary text-primary-content" : "text-base-content opacity-70 hover:opacity-100"
        }`}
        title="Notifications"
      >
        <BellIcon className="size-6" />
        <span className="text-xs font-medium">Inbox</span>
      </Link>

      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
          currentPath === "/profile" ? "bg-primary text-primary-content" : "text-base-content opacity-70 hover:opacity-100"
        }`}
        title="Profile"
      >
        <User className="size-6" />
        <span className="text-xs font-medium">Profile</span>
      </Link>
    </nav>
  );
};

export default MobileNav;
