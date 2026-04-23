import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, Menu } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-14 sm:h-16 flex items-center">
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/" className="flex items-center gap-2">
                <ShipWheelIcon className="size-7 sm:size-8 text-primary" />
                <span className="text-xl sm:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  BhashaBandhu
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications - Hidden on chat page for mobile */}
            {!isChatPage && (
              <Link to={"/notifications"} className="hidden sm:flex">
                <button className="btn btn-ghost btn-circle btn-sm sm:btn-md">
                  <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
                </button>
              </Link>
            )}

            {/* Theme Selector - Icon only on mobile */}
            <div className="scale-75 sm:scale-100 origin-right">
              <ThemeSelector />
            </div>

            {/* Profile Avatar */}
            <div className="avatar hidden sm:block">
              <Link to="/profile">
                <div className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer">
                  <img
                    src={authUser?.profilePic || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </Link>
            </div>

            {/* Logout button - Icon only on mobile */}
            <button 
              className="btn btn-ghost btn-circle btn-sm sm:btn-md"
              onClick={logoutMutation}
              title="Logout"
            >
              <LogOutIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
