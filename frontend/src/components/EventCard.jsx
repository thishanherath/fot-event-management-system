import { useState } from "react";

function EventCard({
    event,
    userRole,
    isRegistered = false,
    registrationId = null,
    onRegister,
    onCancelRegistration,
    onApprove,
    onDelete
}) {
    const [actionLoading, setActionLoading] = useState(false);

    const formattedDate = event.eventDate
        ? new Date(event.eventDate).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
          })
        : "Date TBA";

    const registrationsCount = event.registrations ? event.registrations.length : 0;
    const capacity = event.capacity || 100;
    const isFull = registrationsCount >= capacity;
    const percentage = Math.min(Math.round((registrationsCount / capacity) * 100), 100);

    const handleRegisterClick = async () => {
        if (!onRegister) return;
        setActionLoading(true);
        try {
            await onRegister(event.id);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelClick = async () => {
        if (!onCancelRegistration || !registrationId) return;
        setActionLoading(true);
        try {
            await onCancelRegistration(registrationId);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveClick = async () => {
        if (!onApprove) return;
        setActionLoading(true);
        try {
            await onApprove(event.id);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClick = async () => {
        if (!onDelete) return;
        setActionLoading(true);
        try {
            await onDelete(event.id);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 hover:border-[#EAA91D] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between border-t-4 border-t-[#6B1D1D]">
            <div>
                {/* Event Photo Banner */}
                <div className="relative h-44 w-full mb-4 overflow-hidden bg-[#4C1414]">
                    <img
                        src={
                            event.imageUrl ||
                            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lecture_hall_of_the_University_of_Helsinki.jpg/800px-Lecture_hall_of_the_University_of_Helsinki.jpg"
                        }
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span
                        className={`absolute bottom-2 right-2 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow ${
                            event.status === "APPROVED"
                                ? "bg-green-600 text-white"
                                : event.status === "PENDING_APPROVAL"
                                ? "bg-[#EAA91D] text-[#4C1414]"
                                : "bg-red-600 text-white"
                        }`}
                    >
                        {event.status?.replace("_", " ")}
                    </span>
                </div>

                {/* Header Info */}
                <div className="px-6">
                    <h3 className="text-lg font-bold text-[#6B1D1D] tracking-tight leading-snug font-serif mb-2">
                        {event.title}
                    </h3>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {event.description || "Official academic event organized under the FOT university curriculum."}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-5 text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="flex items-center gap-2 font-medium">
                        <span className="text-[#EAA91D] font-bold text-sm">🗓</span>
                        <span className="text-gray-800 font-semibold">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 font-medium">
                        <span className="text-[#EAA91D] font-bold text-sm">📍</span>
                        <span className="text-gray-700">{event.location || "TBA"}</span>
                    </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-gray-600">
                            Student Registrations
                        </span>
                        <span className="text-[#6B1D1D]">
                            {registrationsCount} / {capacity} Enrolled
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden border border-gray-300">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                isFull ? "bg-red-600" : percentage > 80 ? "bg-[#EAA91D]" : "bg-[#6B1D1D]"
                            }`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
                </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-200 flex items-center justify-between gap-3">
                {/* Student View */}
                {userRole === "STUDENT" && (
                    <>
                        {isRegistered ? (
                            <div className="w-full flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-800 bg-green-100 border border-green-300 px-3 py-2 rounded">
                                    <span>✓ Registered</span>
                                </span>
                                {onCancelRegistration && (
                                    <button
                                        onClick={handleCancelClick}
                                        disabled={actionLoading}
                                        className="text-xs px-3 py-2 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-semibold transition"
                                    >
                                        {actionLoading ? "..." : "Cancel Seat"}
                                    </button>
                                )}
                            </div>
                        ) : isFull ? (
                            <button
                                disabled
                                className="w-full bg-gray-200 text-gray-500 font-bold uppercase tracking-wider py-2.5 rounded text-xs cursor-not-allowed border border-gray-300"
                            >
                                Event Full
                            </button>
                        ) : (
                            <button
                                onClick={handleRegisterClick}
                                disabled={actionLoading || event.status !== "APPROVED"}
                                className="w-full bg-[#6B1D1D] hover:bg-[#571515] text-white font-bold uppercase tracking-wider py-2.5 px-4 rounded text-xs shadow-sm hover:shadow transition duration-150 disabled:opacity-50"
                            >
                                {actionLoading ? "Enrolling..." : "Register for Event"}
                            </button>
                        )}
                    </>
                )}

                {/* Admin View */}
                {userRole === "ADMIN" && (
                    <div className="w-full flex items-center justify-end gap-2">
                        {event.status === "PENDING_APPROVAL" && onApprove && (
                            <button
                                onClick={handleApproveClick}
                                disabled={actionLoading}
                                className="text-xs bg-green-700 hover:bg-green-800 text-white font-bold uppercase tracking-wider px-4 py-2 rounded transition shadow-sm"
                            >
                                Approve
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={handleDeleteClick}
                                disabled={actionLoading}
                                className="text-xs bg-white hover:bg-red-700 text-red-700 hover:text-white border border-red-700 font-bold uppercase tracking-wider px-4 py-2 rounded transition"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventCard;
