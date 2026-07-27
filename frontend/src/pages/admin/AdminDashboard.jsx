import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";
import { getAllStudents, registerStudentByAdmin, deleteStudent } from "../../services/adminService";
import { getAllEvents, approveEvent, deleteEventById, createEvent, getDashboardStats } from "../../services/eventService";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [students, setStudents] = useState([]);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Register Student Modal Form State
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [studentName, setStudentName] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [studentPassword, setStudentPassword] = useState("student123");
    const [registering, setRegistering] = useState(false);

    // Create Event Modal Form State
    const [showEventModal, setShowEventModal] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDesc, setEventDesc] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventCapacity, setEventCapacity] = useState(100);
    const [creatingEvent, setCreatingEvent] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [studentsRes, eventsRes, statsRes] = await Promise.all([
                getAllStudents(),
                getAllEvents(),
                getDashboardStats()
            ]);
            setStudents(studentsRes.data || []);
            setEvents(eventsRes.data || []);
            setStats(statsRes.data || null);
        } catch (err) {
            setError("Failed to load admin dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRegisterStudent = async (e) => {
        e.preventDefault();
        setRegistering(true);
        setError("");
        setSuccessMsg("");
        try {
            await registerStudentByAdmin({
                name: studentName,
                email: studentEmail,
                password: studentPassword
            });
            setSuccessMsg(`Successfully registered student: ${studentName} (${studentEmail})`);
            setStudentName("");
            setStudentEmail("");
            setStudentPassword("student123");
            setShowStudentModal(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Error registering student. Email may already exist.");
        } finally {
            setRegistering(false);
        }
    };

    const handleDeleteStudent = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove student ${name}?`)) return;
        try {
            await deleteStudent(id);
            setSuccessMsg(`Removed student ${name}`);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete student.");
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setCreatingEvent(true);
        setError("");
        try {
            await createEvent({
                title: eventTitle,
                description: eventDesc,
                location: eventLocation,
                eventDate: eventDate ? new Date(eventDate).toISOString() : null,
                capacity: Number(eventCapacity)
            });
            setSuccessMsg("University event created successfully!");
            setEventTitle("");
            setEventDesc("");
            setEventLocation("");
            setEventDate("");
            setShowEventModal(false);
            fetchData();
        } catch (err) {
            setError("Failed to create event.");
        } finally {
            setCreatingEvent(false);
        }
    };

    const handleApproveEvent = async (id) => {
        try {
            await approveEvent(id);
            setSuccessMsg("Event approved!");
            fetchData();
        } catch (err) {
            setError("Failed to approve event.");
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEventById(id);
            setSuccessMsg("Event deleted.");
            fetchData();
        } catch (err) {
            setError("Failed to delete event.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div>
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Administration Dashboard
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Overview of university student enrollments and campus event metrics.
                            </p>
                        </div>

                        {/* Stat Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                    Total Registered Students
                                </span>
                                <div className="text-4xl font-extrabold text-white mt-2">
                                    {stats?.totalStudents ?? students.length}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    Enrolled by Admin
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl">
                                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                                    Total University Events
                                </span>
                                <div className="text-4xl font-extrabold text-white mt-2">
                                    {stats?.totalEvents ?? events.length}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    All campus events
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                                    Approved Events
                                </span>
                                <div className="text-4xl font-extrabold text-white mt-2">
                                    {stats?.approvedEvents ?? events.filter(e => e.status === "APPROVED").length}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    Available to students
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
                                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                                    Total Registrations
                                </span>
                                <div className="text-4xl font-extrabold text-white mt-2">
                                    {stats?.totalRegistrations ?? 0}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    Student ticket bookings
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4">
                                Quick Administrative Actions
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => { setActiveTab("students"); setShowStudentModal(true); }}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 text-sm transition flex items-center gap-2"
                                >
                                    <span>+ Register New Student</span>
                                </button>
                                <button
                                    onClick={() => { setActiveTab("events"); setShowEventModal(true); }}
                                    className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 text-sm transition flex items-center gap-2"
                                >
                                    <span>+ Create Campus Event</span>
                                </button>
                                <button
                                    onClick={fetchData}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-5 py-2.5 rounded-xl border border-slate-700 text-sm transition"
                                >
                                    Refresh Metrics
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STUDENTS TAB */}
                {activeTab === "students" && (
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">
                                    University Student Directory
                                </h1>
                                <p className="text-slate-400 text-sm mt-1">
                                    All students are registered by the administration to grant role-based system access.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowStudentModal(true)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 text-sm transition flex items-center justify-center gap-2"
                            >
                                <span>+ Register New Student</span>
                            </button>
                        </div>

                        {/* Students Table */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
                                            <th className="py-4 px-6">ID</th>
                                            <th className="py-4 px-6">Student Name</th>
                                            <th className="py-4 px-6">University Email</th>
                                            <th className="py-4 px-6">Role</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 text-sm">
                                        {students.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-slate-500">
                                                    No students registered yet. Click "Register New Student" to begin.
                                                </td>
                                            </tr>
                                        ) : (
                                            students.map((st) => (
                                                <tr key={st.id} className="hover:bg-slate-800/40 transition">
                                                    <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                                                        #{st.id}
                                                    </td>
                                                    <td className="py-4 px-6 font-semibold text-white">
                                                        {st.name}
                                                    </td>
                                                    <td className="py-4 px-6 text-indigo-400">
                                                        {st.email}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                                            STUDENT
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button
                                                            onClick={() => handleDeleteStudent(st.id, st.name)}
                                                            className="text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* EVENTS TAB */}
                {activeTab === "events" && (
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">
                                    University Events & Approvals
                                </h1>
                                <p className="text-slate-400 text-sm mt-1">
                                    Manage events, approve pending submissions, or create new campus activities.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowEventModal(true)}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 text-sm transition flex items-center justify-center gap-2"
                            >
                                <span>+ Create Campus Event</span>
                            </button>
                        </div>

                        {events.length === 0 ? (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                                No events found in the university database.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((ev) => (
                                    <EventCard
                                        key={ev.id}
                                        event={ev}
                                        userRole="ADMIN"
                                        onApprove={handleApproveEvent}
                                        onDelete={handleDeleteEvent}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* REGISTER STUDENT MODAL */}
            {showStudentModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">
                                Register New University Student
                            </h3>
                            <button
                                onClick={() => setShowStudentModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">
                            Admin registration ensures that only officially verified students can log into the event system.
                        </p>

                        <form onSubmit={handleRegisterStudent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Student Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Alex Johnson"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    University Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. alex@fot.edu"
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Initial Password
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={studentPassword}
                                    onChange={(e) => setStudentPassword(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 font-mono"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStudentModal(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={registering}
                                    className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-600/30"
                                >
                                    {registering ? "Registering..." : "Register Student"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CREATE EVENT MODAL */}
            {showEventModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">
                                Create University Event
                            </h3>
                            <button
                                onClick={() => setShowEventModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. FOT AI Symposium"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Event description and details..."
                                    value={eventDesc}
                                    onChange={(e) => setEventDesc(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Auditorium"
                                        value={eventLocation}
                                        onChange={(e) => setEventLocation(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                        Max Capacity
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={eventCapacity}
                                        onChange={(e) => setEventCapacity(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Event Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEventModal(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingEvent}
                                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium shadow-md shadow-purple-600/30"
                                >
                                    {creatingEvent ? "Creating..." : "Create Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
