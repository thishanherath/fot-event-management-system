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
            setError("Failed to load university events.");
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
            setSuccessMsg("Successfully registered for the university event! Check 'My Registrations' tab.");
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Could not register for this event. Event may be full or already registered.");
        }
    };

    const handleCancelReg = async (registrationId) => {
        if (!window.confirm("Are you sure you want to cancel your registration for this event?")) return;
        setError("");
        setSuccessMsg("");
        try {
            await cancelRegistration(registrationId);
            setSuccessMsg("Your event registration has been cancelled.");
            fetchData();
        } catch (err) {
            setError("Failed to cancel registration.");
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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
                    <div className="max-w-2xl">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            FOT University Student Portal
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
                            Welcome back, {user?.name || "Student"}!
                        </h1>
                        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                            Explore upcoming university seminars, symposia, and workshops. As an enrolled student registered by university administration, you can reserve your seat instantly.
                        </p>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError("")} className="text-rose-400 hover:text-white">✕</button>
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center justify-between">
                        <span>{successMsg}</span>
                        <button onClick={() => setSuccessMsg("")} className="text-emerald-400 hover:text-white">✕</button>
                    </div>
                )}

                {/* AVAILABLE EVENTS TAB */}
                {activeTab === "available" && (
                    <div>
                        {/* Search & Filter Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
                            <div className="relative flex-1 max-w-md">
                                <svg
                                    className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
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
                                    className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-indigo-500 transition"
                                />
                            </div>

                            {/* Filter Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                                <button
                                    onClick={() => setFilterStatus("all")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                                        filterStatus === "all"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-slate-800 text-slate-400 hover:text-white"
                                    }`}
                                >
                                    All Events ({availableEvents.length})
                                </button>
                                <button
                                    onClick={() => setFilterStatus("not_registered")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                                        filterStatus === "not_registered"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-slate-800 text-slate-400 hover:text-white"
                                    }`}
                                >
                                    Available to Register
                                </button>
                                <button
                                    onClick={() => setFilterStatus("registered")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                                        filterStatus === "registered"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-slate-800 text-slate-400 hover:text-white"
                                    }`}
                                >
                                    Registered ({myRegistrations.length})
                                </button>
                            </div>
                        </div>

                        {/* Events Grid */}
                        {loading ? (
                            <div className="py-16 text-center text-slate-500">
                                Loading university event catalog...
                            </div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                                No university events matching your search criteria.
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
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">
                                My Registered Events
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Events that you are currently enrolled to attend.
                            </p>
                        </div>

                        {myRegistrations.length === 0 ? (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                                You haven't registered for any events yet. Check out the "Available Events" tab to reserve your seat!
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
        </div>
    );
}

export default StudentDashboard;
