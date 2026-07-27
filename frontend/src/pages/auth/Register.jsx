import React from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

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

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border-t-8 border-t-[#6B1D1D] border-b-4 border-b-[#EAA91D] p-8 text-center">
                    {/* Clean University Logo Display */}
                    <div className="mb-4 flex items-center justify-center">
                        <img
                            src="/logo.png"
                            alt="Faculty of Technology Logo"
                            className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                        <div className="hidden inline-flex items-center justify-center w-16 h-16 bg-gradient-to-b from-[#7A1E1E] to-[#5A1414] rounded-full border-2 border-[#EAA91D] text-[#EAA91D] shadow-md">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                <path d="M12 5.5A2.5 2.5 0 009.5 8H11a1 1 0 012 0h1.5A2.5 2.5 0 0012 5.5zM12 11c-1.38 0-2.5 1.12-2.5 2.5V17h5v-3.5C14.5 12.12 13.38 11 12 11z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-[#6B1D1D] tracking-tight font-serif uppercase">
                        University of Ruhuna
                    </h1>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-1">
                        Faculty of Technology • Event Management System
                    </p>
                    <div className="w-16 h-1 bg-[#EAA91D] mx-auto mt-3 rounded-full mb-6"></div>

                    <div className="p-5 bg-[#F9F6F0] border border-[#EAA91D]/60 rounded-lg mb-6 text-left">
                        <h3 className="text-sm font-bold text-[#6B1D1D] uppercase tracking-wide mb-2">
                            Institutional Registration Policy
                        </h3>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            In accordance with University of Ruhuna regulations, student accounts are provisioned and registered exclusively by the FOT Administration. Self-registration is disabled for public users to ensure security and verified academic enrollment.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-[#6B1D1D] hover:bg-[#571515] text-white font-bold uppercase tracking-wider py-3 px-6 rounded shadow-md hover:shadow-lg transition duration-200 text-sm"
                    >
                        Proceed to Academic Login Portal →
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#4C1414] text-white text-xs py-4 px-6 border-t border-[#EAA91D]/40 text-center">
                <p className="font-medium">
                    © 2026 University of Ruhuna, Sri Lanka — Faculty of Technology (FOT). All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}
