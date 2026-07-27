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
        <div className="bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl p-5 shadow-lg backdrop-blur-sm transition duration-200 flex flex-col justify-between">
            <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                        {event.title}
                    </h3>
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex-shrink-0 ${
                            event.status === "APPROVED"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : event.status === "PENDING_APPROVAL"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                    >
                        {event.status?.replace("_", " ")}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                    {event.description || "No detailed description provided for this university event."}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-slate-300 font-medium">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-slate-300">{event.location || "TBA"}</span>
                    </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">
                            Registered Participants
                        </span>
                        <span className="font-semibold text-slate-200">
                            {registrationsCount} / {capacity}
                        </span>
                    </div>
                    <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                                isFull ? "bg-rose-500" : percentage > 80 ? "bg-amber-500" : "bg-indigo-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                {/* Student View */}
                {userRole === "STUDENT" && (
                    <>
                        {isRegistered ? (
                            <div className="w-full flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-lg">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Registered
                                </span>
                                {onCancelRegistration && (
                                    <button
                                        onClick={handleCancelClick}
                                        disabled={actionLoading}
                                        className="text-xs px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition"
                                    >
                                        {actionLoading ? "..." : "Cancel"}
                                    </button>
                                )}
                            </div>
                        ) : isFull ? (
                            <button
                                disabled
                                className="w-full bg-slate-700 text-slate-400 font-medium py-2 rounded-lg text-xs cursor-not-allowed"
                            >
                                Event Full
                            </button>
                        ) : (
                            <button
                                onClick={handleRegisterClick}
                                disabled={actionLoading || event.status !== "APPROVED"}
                                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium py-2 px-4 rounded-lg text-xs shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
                            >
                                {actionLoading ? "Registering..." : "Register for Event"}
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
                                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg transition"
                            >
                                Approve
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={handleDeleteClick}
                                disabled={actionLoading}
                                className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium px-3 py-1.5 rounded-lg transition"
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
