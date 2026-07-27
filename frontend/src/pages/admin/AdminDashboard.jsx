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
    const [eventImageUrl, setEventImageUrl] = useState("");
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
            setError("Failed to load official administrative data.");
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
            setError(err.response?.data?.message || "Error registering student account. Email may already exist.");
        } finally {
            setRegistering(false);
        }
    };

    const handleDeleteStudent = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove student account for ${name}?`)) return;
        try {
            await deleteStudent(id);
            setSuccessMsg(`Removed student account: ${name}`);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete student account.");
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
                capacity: Number(eventCapacity),
                imageUrl: eventImageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lecture_hall_of_the_University_of_Helsinki.jpg/800px-Lecture_hall_of_the_University_of_Helsinki.jpg"
            });
            setSuccessMsg("University event created successfully!");
            setEventTitle("");
            setEventDesc("");
            setEventLocation("");
            setEventDate("");
            setEventImageUrl("");
            setShowEventModal(false);
            fetchData();
        } catch (err) {
            setError("Failed to create campus event.");
        } finally {
            setCreatingEvent(false);
        }
    };

    const handleApproveEvent = async (id) => {
        try {
            await approveEvent(id);
            setSuccessMsg("University event approved and published!");
            fetchData();
        } catch (err) {
            setError("Failed to approve event.");
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEventById(id);
            setSuccessMsg("Event removed from system.");
            fetchData();
        } catch (err) {
            setError("Failed to delete event.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6F9] text-gray-900 flex flex-col font-sans">
            <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
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

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div>
                        {/* Title Section */}
                        <div className="mb-8 border-l-4 border-[#6B1D1D] pl-4">
                            <h1 className="text-2xl sm:text-3xl font-black text-[#6B1D1D] tracking-tight font-serif uppercase">
                                University Administration Dashboard
                            </h1>
                            <p className="text-gray-600 text-sm mt-1 font-medium">
                                Institutional overview of student enrollments, event governance, and academic activity.
                            </p>
                        </div>

                        {/* Stat Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <div className="bg-white border-t-4 border-t-[#6B1D1D] border border-gray-200 rounded-lg p-6 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Enrolled Students
                                </span>
                                <div className="text-4xl font-extrabold text-[#6B1D1D] mt-2 font-serif">
                                    {stats?.totalStudents ?? students.length}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Registered by Administration
                                </p>
                            </div>

                            <div className="bg-white border-t-4 border-t-[#EAA91D] border border-gray-200 rounded-lg p-6 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Total Campus Events
                                </span>
                                <div className="text-4xl font-extrabold text-[#6B1D1D] mt-2 font-serif">
                                    {stats?.totalEvents ?? events.length}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Symposia, workshops & fairs
                                </p>
                            </div>

                            <div className="bg-white border-t-4 border-t-[#6B1D1D] border border-gray-200 rounded-lg p-6 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Approved Events
                                </span>
                                <div className="text-4xl font-extrabold text-[#6B1D1D] mt-2 font-serif">
                                    {stats?.approvedEvents ?? events.filter(e => e.status === "APPROVED").length}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Active on Student Portal
                                </p>
                            </div>

                            <div className="bg-white border-t-4 border-t-[#EAA91D] border border-gray-200 rounded-lg p-6 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Total Registrations
                                </span>
                                <div className="text-4xl font-extrabold text-[#6B1D1D] mt-2 font-serif">
                                    {stats?.totalRegistrations ?? 0}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Student seat allocations
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm border-l-4 border-l-[#EAA91D]">
                            <h2 className="text-lg font-bold text-[#6B1D1D] mb-4 font-serif uppercase tracking-wide">
                                Administrative Actions
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => { setActiveTab("students"); setShowStudentModal(true); }}
                                    className="bg-[#6B1D1D] hover:bg-[#571515] text-white font-bold px-6 py-2.5 rounded shadow-sm text-sm uppercase tracking-wider transition duration-150 flex items-center gap-2"
                                >
                                    <span>+ Register Student Account</span>
                                </button>
                                <button
                                    onClick={() => { setActiveTab("events"); setShowEventModal(true); }}
                                    className="bg-white hover:bg-[#F9F6F0] text-[#6B1D1D] border-2 border-[#6B1D1D] font-bold px-6 py-2.5 rounded shadow-sm text-sm uppercase tracking-wider transition duration-150 flex items-center gap-2"
                                >
                                    <span>+ Create University Event</span>
                                </button>
                                <button
                                    onClick={fetchData}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded border border-gray-300 text-sm uppercase tracking-wider transition duration-150"
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-l-4 border-[#6B1D1D] pl-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-[#6B1D1D] tracking-tight font-serif uppercase">
                                    Student Account Registry
                                </h1>
                                <p className="text-gray-600 text-sm mt-1 font-medium">
                                    In accordance with University of Ruhuna policy, all student accounts are registered by FOT Administration.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowStudentModal(true)}
                                className="bg-[#6B1D1D] hover:bg-[#571515] text-white font-bold px-5 py-2.5 rounded shadow-sm text-sm uppercase tracking-wider transition duration-150"
                            >
                                + Register New Student
                            </button>
                        </div>

                        {/* Official Academic Table */}
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#6B1D1D] text-white text-xs uppercase tracking-wider">
                                            <th className="py-4 px-6 border-r border-[#832727]">Reg. ID</th>
                                            <th className="py-4 px-6 border-r border-[#832727]">Student Full Name</th>
                                            <th className="py-4 px-6 border-r border-[#832727]">University Email Address</th>
                                            <th className="py-4 px-6 border-r border-[#832727]">Role</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-sm">
                                        {students.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                                                    No student accounts registered in the database. Click "+ Register New Student" above.
                                                </td>
                                            </tr>
                                        ) : (
                                            students.map((st) => (
                                                <tr key={st.id} className="hover:bg-[#F9F6F0] transition duration-150">
                                                    <td className="py-4 px-6 text-gray-600 font-mono text-xs font-bold">
                                                        #{st.id}
                                                    </td>
                                                    <td className="py-4 px-6 font-bold text-[#6B1D1D]">
                                                        {st.name}
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-800">
                                                        {st.email}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-300">
                                                            STUDENT
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button
                                                            onClick={() => handleDeleteStudent(st.id, st.name)}
                                                            className="text-red-700 hover:text-white bg-red-50 hover:bg-red-700 border border-red-300 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition"
                                                        >
                                                            Remove
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-l-4 border-[#6B1D1D] pl-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-[#6B1D1D] tracking-tight font-serif uppercase">
                                    University Event Governance
                                </h1>
                                <p className="text-gray-600 text-sm mt-1 font-medium">
                                    Manage, approve, or create events for the Faculty of Technology (FOT) campus.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowEventModal(true)}
                                className="bg-[#6B1D1D] hover:bg-[#571515] text-white font-bold px-5 py-2.5 rounded shadow-sm text-sm uppercase tracking-wider transition duration-150"
                            >
                                + Create University Event
                            </button>
                        </div>

                        {events.length === 0 ? (
                            <div className="bg-white border border-gray-300 rounded-lg p-12 text-center text-gray-500 font-medium">
                                No university events recorded in the database.
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white border-t-8 border-t-[#6B1D1D] border-b-4 border-b-[#EAA91D] rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4 border-b pb-3">
                            <h3 className="text-lg font-black text-[#6B1D1D] font-serif uppercase tracking-wide">
                                Register New Student Account
                            </h3>
                            <button
                                onClick={() => setShowStudentModal(false)}
                                className="text-gray-400 hover:text-gray-700 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                            Account registration by University Administration is mandatory for all students to access the event reservation portal.
                        </p>

                        <form onSubmit={handleRegisterStudent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Student Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Kasun Perera"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-4 py-2.5 text-sm outline-none focus:border-[#6B1D1D]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    University Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. kasun@fot.edu or student@ruh.ac.lk"
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-4 py-2.5 text-sm outline-none focus:border-[#6B1D1D]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Initial Password
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={studentPassword}
                                    onChange={(e) => setStudentPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-4 py-2.5 text-sm outline-none focus:border-[#6B1D1D] font-mono font-semibold"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowStudentModal(false)}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold uppercase tracking-wider text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={registering}
                                    className="px-5 py-2 rounded bg-[#6B1D1D] hover:bg-[#571515] text-white font-bold uppercase tracking-wider text-xs shadow-sm"
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white border-t-8 border-t-[#6B1D1D] border-b-4 border-b-[#EAA91D] rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4 border-b pb-3">
                            <h3 className="text-lg font-black text-[#6B1D1D] font-serif uppercase tracking-wide">
                                Create University Event
                            </h3>
                            <button
                                onClick={() => setShowEventModal(false)}
                                className="text-gray-400 hover:text-gray-700 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. FOT Annual AI Symposium 2026"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-4 py-2 text-sm outline-none focus:border-[#6B1D1D]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Academic details and guest speaker information..."
                                    value={eventDesc}
                                    onChange={(e) => setEventDesc(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-4 py-2 text-sm outline-none focus:border-[#6B1D1D]"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Campus Location
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Main Auditorium"
                                        value={eventLocation}
                                        onChange={(e) => setEventLocation(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm outline-none focus:border-[#6B1D1D]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Max Capacity
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={eventCapacity}
                                        onChange={(e) => setEventCapacity(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm outline-none focus:border-[#6B1D1D]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Event Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm outline-none focus:border-[#6B1D1D]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Event Cover Image URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://upload.wikimedia.org/..."
                                    value={eventImageUrl}
                                    onChange={(e) => setEventImageUrl(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm outline-none focus:border-[#6B1D1D]"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowEventModal(false)}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold uppercase tracking-wider text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingEvent}
                                    className="px-5 py-2 rounded bg-[#6B1D1D] hover:bg-[#571515] text-white font-bold uppercase tracking-wider text-xs shadow-sm"
                                >
                                    {creatingEvent ? "Creating..." : "Create Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Institutional Footer */}
            <footer className="bg-[#4C1414] text-white text-xs py-4 px-6 border-t border-[#EAA91D]/40 text-center mt-12">
                <p className="font-medium">
                    © 2026 University of Ruhuna, Sri Lanka — Faculty of Technology (FOT). Administrative Control Panel.
                </p>
            </footer>
        </div>
    );
}

export default AdminDashboard;
