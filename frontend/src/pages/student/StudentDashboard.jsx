import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";
import { getAllEvents } from "../../services/eventService";
import { registerForEvent, getMyRegistrations, cancelRegistration } from "../../services/registrationService";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("available");
    const [events, setEvents] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // "all" | "registered" | "not_registered"
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [eventsRes, regRes] = await Promise.all([
                getAllEvents(),
                getMyRegistrations()
            ]);
            setEvents(eventsRes.data || []);
            setMyRegistrations(regRes.data || []);
        } catch (err) {
            setError("Failed to load university event catalog.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const registeredEventIds = new Set(
        myRegistrations.map((reg) => reg.event?.id).filter(Boolean)
    );

    const handleRegisterForEvent = async (eventId) => {
        setError("");
        setSuccessMsg("");
        try {
            await registerForEvent(eventId);
            setSuccessMsg("Successfully enrolled in the university event! Visit 'My Registrations' to view your ticket.");
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Could not register for this event. Event may be at full capacity or already registered.");
        }
    };

    const handleCancelReg = async (registrationId) => {
        if (!window.confirm("Are you sure you want to cancel your seat registration for this academic event?")) return;
        setError("");
        setSuccessMsg("");
        try {
            await cancelRegistration(registrationId);
            setSuccessMsg("Your event reservation has been cancelled.");
            fetchData();
        } catch (err) {
            setError("Failed to cancel reservation.");
        }
    };

    // Filter only APPROVED events for students
    const availableEvents = events.filter((ev) => ev.status === "APPROVED");

    const filteredEvents = availableEvents.filter((ev) => {
        const matchesSearch =
            ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ev.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ev.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const isReg = registeredEventIds.has(ev.id);
        if (filterStatus === "registered") return matchesSearch && isReg;
        if (filterStatus === "not_registered") return matchesSearch && !isReg;
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F4F6F9] text-gray-900 flex flex-col font-sans">
            <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
                {/* Academic Institutional Hero Banner */}
                <div className="bg-gradient-to-r from-[#6B1D1D] via-[#571515] to-[#4C1414] text-white border-b-4 border-[#EAA91D] rounded-xl p-8 mb-8 shadow-md relative overflow-hidden">
                    <div className="max-w-3xl relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EAA91D] text-[#4C1414] font-extrabold text-xs uppercase tracking-wider mb-3">
                            <span>★ UNIVERSITY OF RUHUNA — FOT</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-serif uppercase">
                            Welcome, {user?.name || "Student"}
                        </h1>
                        <p className="text-gray-200 text-sm sm:text-base mt-2 leading-relaxed font-medium">
                            Browse upcoming academic symposia, inter-faculty hackathons, and career workshops. Your account is officially verified by the University Administration.
                        </p>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-700 rounded-r text-red-800 text-sm flex items-center justify-between shadow-sm">
                        <span>{error}</span>
                        <button onClick={() => setError("")} className="font-bold">✕</button>
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-700 rounded-r text-green-800 text-sm flex items-center justify-between shadow-sm">
                        <span>{successMsg}</span>
                        <button onClick={() => setSuccessMsg("")} className="font-bold">✕</button>
                    </div>
                )}

                {/* AVAILABLE EVENTS TAB */}
                {activeTab === "available" && (
                    <div>
                        {/* Search & Filter Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white border border-gray-300 p-4 rounded-lg shadow-sm">
                            <div className="relative flex-1 max-w-md">
                                <svg
                                    className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search events by title, topic, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#6B1D1D] transition"
                                />
                            </div>

                            {/* Filter Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                                <button
                                    onClick={() => setFilterStatus("all")}
                                    className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                                        filterStatus === "all"
                                            ? "bg-[#6B1D1D] text-white shadow-sm"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    All Events ({availableEvents.length})
                                </button>
                                <button
                                    onClick={() => setFilterStatus("not_registered")}
                                    className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                                        filterStatus === "not_registered"
                                            ? "bg-[#6B1D1D] text-white shadow-sm"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Available to Register
                                </button>
                                <button
                                    onClick={() => setFilterStatus("registered")}
                                    className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                                        filterStatus === "registered"
                                            ? "bg-[#6B1D1D] text-white shadow-sm"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Enrolled ({myRegistrations.length})
                                </button>
                            </div>
                        </div>

                        {/* Events Grid */}
                        {loading ? (
                            <div className="py-16 text-center text-gray-500 font-medium">
                                Loading University of Ruhuna event catalog...
                            </div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="bg-white border border-gray-300 rounded-lg p-12 text-center text-gray-500 font-medium">
                                No campus events matching your search criteria.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((ev) => {
                                    const isReg = registeredEventIds.has(ev.id);
                                    const regObj = myRegistrations.find((r) => r.event?.id === ev.id);
                                    return (
                                        <EventCard
                                            key={ev.id}
                                            event={ev}
                                            userRole="STUDENT"
                                            isRegistered={isReg}
                                            registrationId={regObj?.id}
                                            onRegister={handleRegisterForEvent}
                                            onCancelRegistration={handleCancelReg}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* MY REGISTRATIONS TAB */}
                {activeTab === "my-registrations" && (
                    <div>
                        <div className="mb-6 border-l-4 border-[#6B1D1D] pl-4">
                            <h2 className="text-xl sm:text-2xl font-black text-[#6B1D1D] font-serif uppercase">
                                My Enrolled Campus Events
                            </h2>
                            <p className="text-gray-600 text-sm mt-1 font-medium">
                                Academic events you have reserved seats to attend.
                            </p>
                        </div>

                        {myRegistrations.length === 0 ? (
                            <div className="bg-white border border-gray-300 rounded-lg p-12 text-center text-gray-500 font-medium">
                                You have not enrolled in any campus events yet. Visit the "Available Campus Events" tab to reserve your seat!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myRegistrations.map((reg) => (
                                    <EventCard
                                        key={reg.id}
                                        event={reg.event}
                                        userRole="STUDENT"
                                        isRegistered={true}
                                        registrationId={reg.id}
                                        onCancelRegistration={handleCancelReg}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Institutional Footer */}
            <footer className="bg-[#4C1414] text-white text-xs py-4 px-6 border-t border-[#EAA91D]/40 text-center mt-12">
                <p className="font-medium">
                    © 2026 University of Ruhuna, Sri Lanka — Faculty of Technology (FOT). Student Academic Portal.
                </p>
            </footer>
        </div>
    );
}

export default StudentDashboard;
