import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ activeTab, onSelectTab }) {
    const { user, role, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleDashboardClick = () => {
        if (role === "ADMIN") {
            navigate("/admin");
        } else if (role === "STUDENT") {
            navigate("/student");
        } else if (role === "ORGANIZER") {
            navigate("/organizer");
        } else {
            navigate("/login");
        }
    };

    return (
        <header className="sticky top-0 z-50 shadow-md">
            {/* Main Institutional Navigation Header */}
            <div className="bg-white border-b-4 border-[#EAA91D] px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
                    {/* University Crest Logo & Titles */}
                    <Link to="/" className="flex items-center gap-4 group cursor-pointer">
                        {/* Clean University Logo Display */}
                        <div className="flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                            <img
                                src="/logo.png"
                                alt="Faculty of Technology Logo"
                                className="h-14 sm:h-16 w-auto object-contain drop-shadow-md"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                            {/* Fallback emblem if logo file is missing */}
                            <div className="hidden w-12 h-14 bg-gradient-to-b from-[#7A1E1E] to-[#5A1414] rounded-b-full border-2 border-[#EAA91D] flex-col items-center justify-center p-1 shadow-md">
                                <svg className="w-6 h-6 text-[#EAA91D]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                    <path d="M12 5.5A2.5 2.5 0 009.5 8H11a1 1 0 012 0h1.5A2.5 2.5 0 0012 5.5zM12 11c-1.38 0-2.5 1.12-2.5 2.5V17h5v-3.5C14.5 12.12 13.38 11 12 11z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-[#6B1D1D] tracking-tight leading-none font-serif group-hover:text-[#571515] transition">
                                UNIVERSITY OF RUHUNA
                            </h1>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 tracking-wide mt-1">
                                Faculty of Technology (FOT) — Event Management System
                            </p>
                        </div>
                    </Link>

                    {/* Navigation Tabs (when inside a dashboard) */}
                    {onSelectTab && (
                        <nav className="hidden lg:flex items-center space-x-1">
                            {role === "ADMIN" && (
                                <>
                                    <button
                                        onClick={() => onSelectTab("overview")}
                                        className={`px-4 py-2 font-semibold text-sm transition border-b-2 ${
                                            activeTab === "overview"
                                                ? "text-[#6B1D1D] border-[#6B1D1D] bg-[#F9F6F0]"
                                                : "text-gray-600 border-transparent hover:text-[#6B1D1D] hover:bg-gray-50"
                                        }`}
                                    >
                                        Admin Dashboard
                                    </button>
                                    <button
                                        onClick={() => onSelectTab("students")}
                                        className={`px-4 py-2 font-semibold text-sm transition border-b-2 ${
                                            activeTab === "students"
                                                ? "text-[#6B1D1D] border-[#6B1D1D] bg-[#F9F6F0]"
                                                : "text-gray-600 border-transparent hover:text-[#6B1D1D] hover:bg-gray-50"
                                        }`}
                                    >
                                        Student Registry
                                    </button>
                                    <button
                                        onClick={() => onSelectTab("events")}
                                        className={`px-4 py-2 font-semibold text-sm transition border-b-2 ${
                                            activeTab === "events"
                                                ? "text-[#6B1D1D] border-[#6B1D1D] bg-[#F9F6F0]"
                                                : "text-gray-600 border-transparent hover:text-[#6B1D1D] hover:bg-gray-50"
                                        }`}
                                    >
                                        Event Governance
                                    </button>
                                </>
                            )}

                            {role === "STUDENT" && (
                                <>
                                    <button
                                        onClick={() => onSelectTab("available")}
                                        className={`px-4 py-2 font-semibold text-sm transition border-b-2 ${
                                            activeTab === "available"
                                                ? "text-[#6B1D1D] border-[#6B1D1D] bg-[#F9F6F0]"
                                                : "text-gray-600 border-transparent hover:text-[#6B1D1D] hover:bg-gray-50"
                                        }`}
                                    >
                                        Available Campus Events
                                    </button>
                                    <button
                                        onClick={() => onSelectTab("my-registrations")}
                                        className={`px-4 py-2 font-semibold text-sm transition border-b-2 ${
                                            activeTab === "my-registrations"
                                                ? "text-[#6B1D1D] border-[#6B1D1D] bg-[#F9F6F0]"
                                                : "text-gray-600 border-transparent hover:text-[#6B1D1D] hover:bg-gray-50"
                                        }`}
                                    >
                                        My Registrations
                                    </button>
                                </>
                            )}
                        </nav>
                    )}

                    {/* Right Action Section */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <div className="hidden sm:flex items-center gap-3 border-r border-gray-200 pr-4">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#6B1D1D] leading-tight">
                                            {user?.name || user?.email || "Academic User"}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                                        role === "ADMIN"
                                            ? "bg-[#6B1D1D] text-white border border-[#EAA91D]"
                                            : "bg-[#EAA91D] text-[#4C1414] font-extrabold"
                                    }`}>
                                        {role || "USER"}
                                    </span>
                                </div>

                                {!onSelectTab && (
                                    <button
                                        onClick={handleDashboardClick}
                                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded font-bold text-sm bg-[#6B1D1D] hover:bg-[#571515] text-white transition duration-200 shadow-sm"
                                    >
                                        <span>My Portal →</span>
                                    </button>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded font-semibold text-sm bg-white hover:bg-[#6B1D1D] text-[#6B1D1D] hover:text-white border border-[#6B1D1D] transition duration-200 shadow-sm"
                                    title="Sign Out of University Portal"
                                >
                                    <span>Sign Out</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-bold text-sm bg-[#6B1D1D] hover:bg-[#571515] text-white transition duration-200 shadow-md uppercase tracking-wider"
                                >
                                    <span>Academic Login</span>
                                    <svg className="w-4 h-4 text-[#EAA91D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Tabs for small screens */}
            {onSelectTab && (
                <div className="lg:hidden bg-gray-100 border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto">
                    {role === "ADMIN" && (
                        <>
                            <button
                                onClick={() => onSelectTab("overview")}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                    activeTab === "overview" ? "bg-[#6B1D1D] text-white" : "bg-white text-gray-700"
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => onSelectTab("students")}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                    activeTab === "students" ? "bg-[#6B1D1D] text-white" : "bg-white text-gray-700"
                                }`}
                            >
                                Student Registry
                            </button>
                            <button
                                onClick={() => onSelectTab("events")}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                    activeTab === "events" ? "bg-[#6B1D1D] text-white" : "bg-white text-gray-700"
                                }`}
                            >
                                Events
                            </button>
                        </>
                    )}
                    {role === "STUDENT" && (
                        <>
                            <button
                                onClick={() => onSelectTab("available")}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                    activeTab === "available" ? "bg-[#6B1D1D] text-white" : "bg-white text-gray-700"
                                }`}
                            >
                                Available Events
                            </button>
                            <button
                                onClick={() => onSelectTab("my-registrations")}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                    activeTab === "my-registrations" ? "bg-[#6B1D1D] text-white" : "bg-white text-gray-700"
                                }`}
                            >
                                My Registrations
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}

export default Navbar;
