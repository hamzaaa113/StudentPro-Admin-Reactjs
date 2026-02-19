import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  Plane,
  LogOut,
  Plus,
  Minus,
  X,
  MessageSquare,
  GraduationCap,
  Mail,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "../lib/toast";
import { FILTER_COUNTRIES, getCountryCode } from "../utils/helpers";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showCountries, setShowCountries] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const navItems = [
    { name: "Institutions", path: "/institutions", icon: Building2 },
    { name: "Insurance", path: "/insurance", icon: ShieldCheck },
    { name: "Immigration", path: "/visa-service", icon: Plane },
    // { name: "Accommodation", path: "/accommodation", icon: Home },
    { name: "Skill Assessment", path: "/skill-assessment", icon: GraduationCap },
    { name: "PopUp", path: "/popup", icon: MessageSquare },
    { name: "Contact Us", path: "/contact-us", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isOnInstitutionsPage = location.pathname === "/institutions";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const handleCountryClick = (country: string) => {
    // Navigate to institutions page with country filter
    navigate(`/institutions?country=${encodeURIComponent(country)}`);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed z-50 flex h-screen w-64 flex-col overflow-y-auto bg-[#0A1F38] transition-transform duration-300 ease-in-out lg:static ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} `}
      >
        {/* Custom Scrollbar Styles */}
        <style>{`
        .countries-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .countries-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .countries-scroll::-webkit-scrollbar-thumb {
          background: rgba(171, 219, 192, 0.3);
          border-radius: 3px;
        }
        .countries-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(171, 219, 192, 0.5);
        }
      `}</style>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className="flex items-center justify-center px-6 pb-6 pt-8">
          <img
            src="/studentpro white.png"
            alt="Student Pro Education"
            className="h-auto w-full object-contain grayscale"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isInstitutions = item.path === "/institutions";

            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`text-1xl flex transform items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-all ${
                    active
                      ? "bg-[#ABDBC0] text-[#0A1F38] shadow-md" // active color
                      : "text-white hover:translate-x-1 hover:bg-[#ABDBC0]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-[#0A1F38]" : "text-white/80"}`} />
                  <span>{item.name}</span>
                </Link>

                {/* By Countries Section - Only show when on Institutions page */}
                {isInstitutions && isOnInstitutionsPage && (
                  <div className="ml-3 mt-1">
                    <button
                      onClick={() => setShowCountries(!showCountries)}
                      className="flex w-full items-center gap-2 rounded-lg border-b border-white/10 px-3 py-2 pb-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {showCountries ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      <span>By Countries</span>
                    </button>

                    {/* Countries List */}
                    {showCountries && (
                      <div className="countries-scroll ml-6 mt-2 max-h-96 space-y-0.5 overflow-y-auto pr-2">
                        {FILTER_COUNTRIES.map((country) => {
                          const countryCode = getCountryCode(country);
                          return (
                            <button
                              key={country}
                              onClick={() => handleCountryClick(country)}
                              className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                              title={country}
                            >
                              {countryCode.length === 2 && (
                                <img
                                  src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                                  srcSet={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png 2x`}
                                  width="16"
                                  height="12"
                                  alt={country}
                                  className="object-contain"
                                  loading="lazy"
                                />
                              )}
                              <span className="truncate">{country}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#ABDBC0]"
          >
            <LogOut className="h-5 w-5 text-white" />
            <span className="text-white">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
