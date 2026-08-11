import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Navbar({ activeTab, onSelectTab }) {
    const { user, role, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleDashboardClick = () => {
        if (role === "ADMIN") navigate("/admin");
        else if (role === "STUDENT") navigate("/student");
        else if (role === "ORGANIZER") navigate("/organizer");
        else navigate("/login");
    };

    const isHome = location.pathname === "/";

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">
                    
                    {/* Left: Logo & Title */}
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
                        {/* Logo Image */}
                        <img
                            src="/logo.png"
                            alt="University Logo"
                            className="h-[50px] w-auto object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                        {/* Fallback */}
                        <div className="hidden h-12 w-12 bg-[#8b1515] rounded-full items-center justify-center p-1">
                            <span className="text-white text-xl font-bold">UoR</span>
                        </div>
                        {/* Title Text (styled like the image) */}
                        <div className="flex flex-col justify-center ml-1">
                            <h1 className="text-[17px] sm:text-[19px] font-bold text-[#800000] tracking-tight leading-tight font-sans">
                                University of Ruhuna
                            </h1>
                            <p className="text-[10px] sm:text-[11px] text-gray-500 font-sans tracking-wide mt-0.5">
                                FACULTY OF TECHNOLOGY — EVENT SYSTEM
                            </p>
                        </div>
                    </Link>

                    {/* Right: Navigation Links */}
                    <div className="hidden lg:flex items-center h-full space-x-1 pl-4 font-sans">
                        
                        {/* Always show Home */}
                        <NavItem 
                            label="Home" 
                            isActive={isHome && !onSelectTab} 
                            to="/" 
                        />

                        {/* Render Dashboard Tabs if onSelectTab is provided */}
                        {onSelectTab ? (
                            <>
                                {role === "ADMIN" && (
                                    <>
                                        <NavItem label="Overview" isActive={activeTab === "overview"} onClick={() => onSelectTab("overview")} />
                                        <NavItem label="Students" isActive={activeTab === "students"} onClick={() => onSelectTab("students")} hasDropdown />
                                        <NavItem label="Events" isActive={activeTab === "events"} onClick={() => onSelectTab("events")} hasDropdown />
                                    </>
                                )}
                                {role === "STUDENT" && (
                                    <>
                                        <NavItem label="Available Events" isActive={activeTab === "available"} onClick={() => onSelectTab("available")} hasDropdown />
                                        <NavItem label="My Registrations" isActive={activeTab === "my-registrations"} onClick={() => onSelectTab("my-registrations")} />
                                    </>
                                )}
                                {role === "ORGANIZER" && (
                                    <>
                                        <NavItem label="My Events" isActive={activeTab === "my-events"} onClick={() => onSelectTab("my-events")} hasDropdown />
                                        <NavItem label="Attendees" isActive={activeTab === "attendees"} onClick={() => onSelectTab("attendees")} />
                                    </>
                                )}
                            </>
                        ) : (
                            /* Global Navigation when not in dashboard (mimicking the image layout but with EMS context) */
                            <>
                                <NavItem label="Dashboard" onClick={handleDashboardClick} hasDropdown />
                                <NavItem label="Events" onClick={() => navigate("/login")} hasDropdown />
                                <NavItem label="Faculties" hasDropdown />
                                <NavItem label="Students" hasDropdown />
                                <NavItem label="Staff" hasDropdown />
                                <NavItem label="Research" hasDropdown />
                            </>
                        )}

                        {/* Login/Logout */}
                        <div className="h-full flex items-center ml-2 pl-4">
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-[15px] text-gray-800 hover:text-[#800000] transition-colors"
                                    title={`Logged in as ${user?.name || role}`}
                                >
                                    <span>Logout</span>
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-1.5 text-[15px] text-gray-800 hover:text-[#800000] transition-colors"
                                >
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>

                        {/* Search Icon */}
                        <button className="flex items-center justify-center w-10 h-full text-gray-600 hover:text-[#800000] transition-colors ml-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Toggle (Visible on small screens) */}
                    <div className="lg:hidden flex items-center">
                        <button className="text-gray-600 hover:text-[#800000] p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Tabs for small screens */}
            {onSelectTab && (
                <div className="lg:hidden bg-gray-50 border-t border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto">
                    {role === "ADMIN" && (
                        <>
                            <button onClick={() => onSelectTab("overview")} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTab === "overview" ? "bg-[#800000] text-white" : "bg-white border text-gray-700"}`}>Overview</button>
                            <button onClick={() => onSelectTab("students")} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTab === "students" ? "bg-[#800000] text-white" : "bg-white border text-gray-700"}`}>Students</button>
                            <button onClick={() => onSelectTab("events")} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTab === "events" ? "bg-[#800000] text-white" : "bg-white border text-gray-700"}`}>Events</button>
                        </>
                    )}
                    {role === "STUDENT" && (
                        <>
                            <button onClick={() => onSelectTab("available")} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTab === "available" ? "bg-[#800000] text-white" : "bg-white border text-gray-700"}`}>Available Events</button>
                            <button onClick={() => onSelectTab("my-registrations")} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTab === "my-registrations" ? "bg-[#800000] text-white" : "bg-white border text-gray-700"}`}>My Registrations</button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}

// Reusable Navigation Item Component
function NavItem({ label, isActive, onClick, hasDropdown, to }) {
    const content = (
        <>
            {label}
            {hasDropdown && (
                <svg className="w-3.5 h-3.5 ml-1.5 text-gray-500 group-hover:text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            )}
        </>
    );

    const baseClasses = `relative flex items-center h-full px-4 text-[15px] font-medium transition-colors group cursor-pointer ${
        isActive ? "text-[#800000]" : "text-gray-800 hover:text-[#800000]"
    }`;

    // The thick red bar at the bottom for active items (matches the image)
    const activeIndicator = isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#800000]" />
    );

    if (to) {
        return (
            <Link to={to} className={baseClasses}>
                {content}
                {activeIndicator}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={baseClasses}>
            {content}
            {activeIndicator}
        </button>
    );
}

export default Navbar;

