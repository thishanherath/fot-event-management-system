import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";
import { getMyEvents, createEvent } from "../../services/eventService";

function OrganizerDashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [capacity, setCapacity] = useState(100);

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
                capacity: Number(capacity)
            });
            setShowModal(false);
            setTitle("");
            setDescription("");
            setLocation("");
            setEventDate("");
            fetchMyEvents();
        } catch (err) {
            alert("Error creating event");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <main className="max-w-7xl w-full mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Organizer Dashboard</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        + Create Event
                    </button>
                </div>
                {loading ? (
                    <p className="text-slate-500">Loading events...</p>
                ) : events.length === 0 ? (
                    <p className="text-slate-500">No events created yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((ev) => (
                            <EventCard key={ev.id} event={ev} userRole="ORGANIZER" />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default OrganizerDashboard;
