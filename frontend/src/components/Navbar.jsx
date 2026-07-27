import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({ activeTab, onSelectTab }) {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand / Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-white font-bold text-lg tracking-tight">
                                FOT University
                            </span>
                            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider block">
                                {role === "ADMIN" ? "Admin Management Portal" : "Student Event Portal"}
                            </span>
                        </div>
                    </div>

                    {/* Navigation Tabs (if provided) */}
                    {onSelectTab && (
                        <nav className="hidden md:flex items-center space-x-1">
                            {role === "ADMIN" && (
                                <>
                                    <button
                                        onClick={() => onSelectTab("overview")}
                                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                                            activeTab === "overview"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        onClick={() => onSelectTab("students")}
                                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                                            activeTab === "students"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        Student Directory
                                    </button>
                                    <button
                                        onClick={() => onSelectTab("events")}
                                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                                            activeTab === "events"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        Events & Approvals
                                    </button>
                                </>
                            )}

                            {role === "STUDENT" && (
                                <>
                                    <button
                                        onClick={() => onSelectTab("available")}
                                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                                            activeTab === "available"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        Available Events
                                    </button>
                                    <button
                                        onClick={() => onSelectTab("my-registrations")}
                                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                                            activeTab === "my-registrations"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        My Registrations
                                    </button>
                                </>
                            )}
                        </nav>
                    )}

                    {/* User info & Logout */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2.5">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white leading-tight">
                                    {user?.name || user?.email || "User"}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {user?.email}
                                </p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                role === "ADMIN"
                                    ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            }`}>
                                {role || "USER"}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-sm font-medium transition"
                            title="Sign Out"
                        >
                            <span>Sign Out</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
