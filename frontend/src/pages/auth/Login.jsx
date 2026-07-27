import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await loginUser({ email, password });
            const data = response.data;
            login(data);

            // Role-based redirect
            if (data.role === "ADMIN") {
                navigate("/admin");
            } else if (data.role === "STUDENT") {
                navigate("/student");
            } else if (data.role === "ORGANIZER") {
                navigate("/organizer");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Invalid university credentials. Please verify your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6F9] flex flex-col justify-between font-sans">
            {/* Simple Back to Homepage Link */}
            <div className="px-6 py-4 max-w-7xl mx-auto w-full">
                <Link
                    to="/"
                    className="text-[#6B1D1D] hover:underline font-bold text-sm inline-flex items-center gap-1 transition"
                >
                    <span>← Return to Campus Homepage</span>
                </Link>
            </div>

            {/* Main Center Box Container */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    
                    {/* LEFT SIDE: Institutional Logo With Academic Title & Text */}
                    <div className="bg-gradient-to-br from-[#5A1414] via-[#6B1D1D] to-[#4C1414] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                        {/* Subtle Background Pattern Decorative Accent */}
                        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#EAA91D]/10 blur-2xl pointer-events-none"></div>
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#EAA91D]/10 blur-2xl pointer-events-none"></div>

                        {/* Top Crest Logo & Institution Name */}
                        <div className="relative z-10">
                            {/* Clean University Logo Display */}
                            <div className="mb-6 flex items-center justify-start">
                                <img
                                    src="/logo.png"
                                    alt="University of Ruhuna Logo"
                                    className="h-20 sm:h-24 w-auto object-contain drop-shadow-xl"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display = "flex";
                                    }}
                                />
                                <div className="hidden inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-[#EAA91D] text-[#EAA91D] shadow-xl">
                                    <svg
                                        className="w-10 h-10"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                        <path d="M12 5.5A2.5 2.5 0 009.5 8H11a1 1 0 012 0h1.5A2.5 2.5 0 0012 5.5zM12 11c-1.38 0-2.5 1.12-2.5 2.5V17h5v-3.5C14.5 12.12 13.38 11 12 11z" />
                                    </svg>
                                </div>
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-[#EAA91D] text-[#4C1414] font-black text-[11px] uppercase tracking-wider mb-3 shadow-sm">
                                Academic Portal
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-serif uppercase leading-tight">
                                University of Ruhuna
                            </h1>
                            <h2 className="text-sm font-extrabold text-[#EAA91D] uppercase tracking-wider mt-1">
                                Faculty of Technology (FOT)
                            </h2>
                            <div className="w-16 h-1 bg-[#EAA91D] mt-4 rounded-full"></div>
                        </div>

                        {/* Mid/Bottom Welcome Text */}
                        <div className="relative z-10 mt-8">
                            <p className="text-sm text-gray-200 font-medium leading-relaxed">
                                Welcome to the official Event Management &amp; Student Registration System. Please sign in with your authorized university email credentials to access academic symposia, research workshops, and course registration.
                            </p>
                            <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between text-xs text-gray-300 font-semibold">
                                <span>ශ්‍රී ලංකා • Sri Lanka</span>
                                <span>Academic Year 2026</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Clean & Simple Sign In Form */}
                    <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight font-serif">
                                Sign In
                            </h2>
                            <p className="text-xs text-gray-500 font-semibold mt-1">
                                Enter your university email address and password to continue.
                            </p>
                        </div>

                        {/* Error Notice */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-700 text-red-800 text-xs sm:text-sm font-medium flex items-center gap-3 rounded-r">
                                <svg
                                    className="w-5 h-5 flex-shrink-0 text-red-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    University Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. name@fot.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 focus:border-[#6B1D1D] focus:ring-2 focus:ring-[#6B1D1D]/20 text-gray-900 rounded-xl px-4 py-3 text-sm placeholder-gray-400 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 focus:border-[#6B1D1D] focus:ring-2 focus:ring-[#6B1D1D]/20 text-gray-900 rounded-xl px-4 py-3 text-sm placeholder-gray-400 outline-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#6B1D1D] hover:bg-[#571515] text-white font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50 text-sm mt-2"
                            >
                                {loading ? "Authenticating..." : "Sign In"}
                            </button>
                        </form>

                        {/* Institutional Notice Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                Institutional Policy: Student accounts are registered and managed exclusively by FOT Administration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formal University Footer */}
            <footer className="bg-[#4C1414] text-white text-xs py-4 px-6 border-t border-[#EAA91D]/40 text-center">
                <p className="font-medium">
                    © 2026 University of Ruhuna, Sri Lanka — Faculty of Technology (FOT). All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}

export default Login;