import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            setError(err.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fillDemoAdmin = () => {
        setEmail("admin@fot.edu");
        setPassword("admin123");
        setError("");
    };

    const fillDemoStudent = () => {
        setEmail("john@fot.edu");
        setPassword("student123");
        setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12 relative overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl p-8 z-10">
                {/* Header / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-xl mb-4 border border-indigo-500/30">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        University Portal
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        FOT Event Management System — Role-Based Login
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            University Email
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="e.g. john@fot.edu or admin@fot.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-lg px-4 py-3 text-sm placeholder-slate-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-lg px-4 py-3 text-sm placeholder-slate-500 outline-none transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium py-3 rounded-lg shadow-lg shadow-indigo-600/30 transition duration-150 ease-in-out disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Sign In to System"}
                    </button>
                </form>

                {/* Quick Demo Credentials */}
                <div className="mt-8 pt-6 border-t border-slate-700/60">
                    <p className="text-xs text-slate-400 text-center mb-3">
                        Testing the Role-Based Login? Click to fill demo credentials:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={fillDemoAdmin}
                            className="text-xs py-2 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition flex items-center justify-center gap-1.5"
                        >
                            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                            Admin Account
                        </button>
                        <button
                            type="button"
                            onClick={fillDemoStudent}
                            className="text-xs py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center justify-center gap-1.5"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Student Account
                        </button>
                    </div>
                </div>

                {/* Role note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        Notice: In accordance with University Policy, all student accounts are registered and managed exclusively by the University Administration.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;