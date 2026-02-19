import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import BookmarkDropdown from "./BookmarkDropdown";
import FormsDropdown from "./FormsDropdown";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/institutions") return "Global Education Providers List";
    if (path === "/insurance") return "Insurance";
    if (path === "/visa-service") return "Visa Service";
    if (path === "/accommodation") return "Accommodation";
    if (path === "/skill-assessment") return "Skill Assessment";
    if (path === "/popup") return "PopUp";
    if (path === "/contact-us") return "Contact Us";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-3 border-b border-gray-200 bg-teal md:px-6">
      <div className="flex items-center flex-1 min-w-0 gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-[#313647] hover:bg-[#ABDBC0] transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-base sm:text-lg md:text-2xl font-bold text-[#313647] truncate">{getPageTitle()}</h1>
        
        {/* Territory text - moved to left side */}
        {location.pathname === "/institutions" && (
          <p className="hidden xl:block  text-[#313647] ml-32">
            If your territory is not listed, please enquire with our team for confirmation.
          </p>
        )}
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-2 ml-4">
        <FormsDropdown />
        <BookmarkDropdown />
      </div>
    </header>
  );
};

export default Header;

