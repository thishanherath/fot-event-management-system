import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";
import { getMyEvents, createEvent } from "../../services/eventService";

const PRESET_IMAGES = [
    {
        label: "🏛️ Lecture Hall / Keynote",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lecture_hall_of_the_University_of_Helsinki.jpg/800px-Lecture_hall_of_the_University_of_Helsinki.jpg"
    },
    {
        label: "🔬 Science & Tech Lab",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Science_laboratory_%2827926131378%29.jpg/800px-Science_laboratory_%2827926131378%29.jpg"
    },
    {
        label: "💻 ICT / Coding Hackathon",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/CERN_Server_03.jpg/800px-CERN_Server_03.jpg"
    },
    {
        label: "🤖 Robotics & Industrial",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Robots-in-laboratory.jpg/800px-Robots-in-laboratory.jpg"
    }
];

function OrganizerDashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Create Event Form Fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [capacity, setCapacity] = useState(100);
    const [imageUrl, setImageUrl] = useState("");

    const fetchMyEvents = async () => {
        setLoading(true);
        try {
            const res = await getMyEvents();
            setEvents(res.data || []);
        } catch (err) {
            console.error("Failed to fetch organizer events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await createEvent({
                title,
                description,
                location,
                eventDate: eventDate ? new Date(eventDate).toISOString() : null,
                capacity: Number(capacity),
                imageUrl: imageUrl || PRESET_IMAGES[0].url
            });
            setShowModal(false);
            setTitle("");
            setDescription("");
            setLocation("");
            setEventDate("");
            setImageUrl("");
            fetchMyEvents();
        } catch (err) {
            alert("Error creating event");
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6F9] text-gray-900 flex flex-col font-sans">
            <Navbar />
            <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex-1">
                <div className="flex justify-between items-center mb-6 border-l-4 border-[#6B1D1D] pl-4">
                    <h1 className="text-2xl font-black text-[#6B1D1D] font-serif uppercase">
                        Organizer Dashboard
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#6B1D1D] hover:bg-[#571515] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center gap-2"
                    >
                        <span>+ Create Campus Event</span>
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500 font-medium">Loading events...</p>
                ) : events.length === 0 ? (
                    <div className="bg-white border border-gray-300 rounded-lg p-12 text-center text-gray-500 font-medium">
                        No events created yet. Click "+ Create Campus Event" above to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((ev) => (
                            <EventCard key={ev.id} event={ev} userRole="ORGANIZER" />
                        ))}
                    </div>
                )}
            </main>

            {/* Create Campus Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-t-8 border-[#6B1D1D] max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                            <div>
                                <h3 className="text-lg font-black text-[#6B1D1D] uppercase font-serif">
                                    Create New Campus Event
                                </h3>
                                <p className="text-xs text-gray-600 font-medium mt-0.5">
                                    Add an academic symposium, workshop, or hackathon with an image banner.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateEvent} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. FOT Inter-Faculty AI Symposium 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-[#6B1D1D] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Provide detailed description of agenda, speakers, and target students..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-[#6B1D1D] outline-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                        Venue / Auditorium *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. FOT Main Auditorium"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-[#6B1D1D] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                        Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-[#6B1D1D] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                        Total Seat Capacity *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-[#6B1D1D] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Event Image URL with One-Click Preset Thumbnails */}
                            <div className="pt-2 border-t border-gray-200">
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                                    Event Cover Image (URL or Select Preset)
                                </label>
                                <input
                                    type="url"
                                    placeholder="Paste any high-res image URL (e.g., https://...)"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-[#6B1D1D] outline-none mb-2"
                                />

                                <div className="text-[11px] font-semibold text-gray-600 mb-2">
                                    Or click to select an official university preset:
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {PRESET_IMAGES.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setImageUrl(preset.url)}
                                            className={`p-1.5 rounded-lg border text-left text-[11px] transition ${
                                                imageUrl === preset.url
                                                    ? "border-[#6B1D1D] bg-[#6B1D1D]/10 font-bold text-[#6B1D1D]"
                                                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                                            }`}
                                        >
                                            <div className="h-10 w-full rounded overflow-hidden mb-1 bg-gray-100">
                                                <img
                                                    src={preset.url}
                                                    alt={preset.label}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="truncate">{preset.label}</div>
                                        </button>
                                    ))}
                                </div>

                                {imageUrl && (
                                    <div className="mt-3">
                                        <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                                            Cover Preview:
                                        </div>
                                        <div className="h-32 w-full rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
                                            <img
                                                src={imageUrl}
                                                alt="Event cover preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-[#6B1D1D] hover:bg-[#571515] text-white text-xs font-bold uppercase tracking-wider shadow-md transition"
                                >
                                    Submit Event for Publication →
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer className="bg-[#4C1414] text-white text-xs py-4 px-6 border-t border-[#EAA91D]/40 text-center">
                <p className="font-medium">
                    © 2026 University of Ruhuna, Sri Lanka — Faculty of Technology (FOT).
                </p>
            </footer>
        </div>
    );
}

export default OrganizerDashboard;
