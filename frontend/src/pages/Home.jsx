import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllEvents } from "../services/eventService";
import { useAuth } from "../context/AuthContext";

/* =========================================================================
   🌟 HOW TO ADD YOUR OWN CUSTOM IMAGES TO THE HOMEPAGE CAROUSEL 🌟
   =========================================================================
   OPTION 1: Using Local Images from your computer (Recommended for Production)
   1. Copy your JPG or PNG image files into: frontend/src/assets/
      (e.g., frontend/src/assets/symposium.jpg)
   2. Import them at the top of this file:
      import symposiumImg from "../assets/symposium.jpg";
      import hackathonImg from "../assets/hackathon.jpg";
   3. Set the 'image' field below to the imported variable name:
      image: symposiumImg,

   OPTION 2: Using Web URLs (Direct Image Links)
   - Simply paste any direct image URL as a string into the 'image' field below.
   ========================================================================= */

const CAROUSEL_SLIDES = [
    {
        id: 1,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lecture_hall_of_the_University_of_Helsinki.jpg/1280px-Lecture_hall_of_the_University_of_Helsinki.jpg",
        badge: "★ ANNUAL RESEARCH SYMPOSIUM 2026",
        title: "FOT Annual Research & Innovation Symposium 2026",
        subtitle: "Join leading engineering technologists, ICT researchers, and industry keynote speakers for Southern Sri Lanka's premier technological symposium at the University of Ruhuna.",
        ctaText: "Reserve Symposium Seat →",
        category: "SYMPOSIUM"
    },
    {
        id: 2,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/CERN_Server_03.jpg/1280px-CERN_Server_03.jpg",
        badge: "★ INTER-FACULTY HACKATHON",
        title: "24-Hour Autonomous AI & Robotics Coding Hackathon",
        subtitle: "Experience live undergraduate coding challenges, autonomous robotics demonstrations, and AI agent bootcamps organized by the Faculty of Technology.",
        ctaText: "Explore Hackathon Details →",
        category: "HACKATHON"
    },
    {
        id: 3,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Conference_hall_in_the_palace_of_nations.jpg/1280px-Conference_hall_in_the_palace_of_nations.jpg",
        badge: "★ CAMPUS INDUSTRIAL FAIR",
        title: "Southern Sri Lanka IT & Engineering Career Fair 2026",
        subtitle: "Connecting Faculty of Technology undergraduates with top software houses, engineering firms, and industrial leaders across Sri Lanka for careers and internships.",
        ctaText: "Browse Career Fair Schedule →",
        category: "CAREER"
    }
];

// Professional FOT Academic Departments with Reliable High-Resolution Photography
const ACADEMIC_DEPARTMENTS = [
    {
        id: "BST",
        filterCategory: "SYMPOSIUM",
        name: "Department of Biosystems Technology",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Science_laboratory_%2827926131378%29.jpg/800px-Science_laboratory_%2827926131378%29.jpg",
        description: "Precision agriculture research symposia, food technology innovations, bioprocess engineering, and sustainable biosystems workshops.",
        ctaText: "Explore BST Symposia"
    },
    {
        id: "ICT",
        filterCategory: "HACKATHON",
        name: "Department of Information & Communication Technology",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/CERN_Server_03.jpg/800px-CERN_Server_03.jpg",
        description: "24-hour inter-faculty coding hackathons, autonomous agentic AI bootcamps, software engineering symposia, and cybersecurity sessions.",
        ctaText: "Explore ICT & Hackathons"
    },
    {
        id: "ET",
        filterCategory: "ALL",
        name: "Department of Engineering Technology",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Industrial_robot_in_a_factory.jpg/800px-Industrial_robot_in_a_factory.jpg",
        description: "Robotics exhibitions, mechatronics industrial sessions, CAD/CAM automation engineering symposia, and mechanical design workshops.",
        ctaText: "Explore Engineering Events"
    },
    {
        id: "DMS",
        filterCategory: "ALL",
        name: "Department of Multidisciplinary Studies",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lecture_hall_of_the_University_of_Helsinki.jpg/800px-Lecture_hall_of_the_University_of_Helsinki.jpg",
        description: "Interdisciplinary academic workshops, industrial management symposia, technology entrepreneurship bootcamps, and leadership seminars for undergraduates.",
        ctaText: "Explore DMS Symposia & Workshops"
    }
];

// Professional Campus Agenda / Live Venue Schedule (National University Style)
const CAMPUS_AGENDA = [
    {
        dateDay: "06",
        dateMonth: "AUG",
        time: "09:00 AM — 11:30 AM",
        venue: "FOT Main Auditorium",
        title: "Inaugural Keynote: AI in Modern Biosystems & Agri-Tech",
        speaker: "Prof. S. R. Herath (Dean, FOT Ruhuna)",
        status: "LIVE KEYNOTE",
        statusColor: "bg-red-600 text-white animate-pulse"
    },
    {
        dateDay: "22",
        dateMonth: "AUG",
        time: "01:00 PM — 04:00 PM",
        venue: "ICT Labs 401 & 402",
        title: "Ruhuna Inter-Faculty Hackathon: Round 01 Sprint",
        speaker: "Coordinated by Dept. of ICT",
        status: "OPEN SEATS",
        statusColor: "bg-green-700 text-white"
    },
    {
        dateDay: "15",
        dateMonth: "SEP",
        time: "02:30 PM — 05:00 PM",
        venue: "Engineering Tech Conference Hall",
        title: "Industrial Automation & Robotics Symposium Panel",
        speaker: "Guest Panel: Engineering Leaders Sri Lanka",
        status: "UPCOMING",
        statusColor: "bg-[#EAA91D] text-[#4C1414] font-bold"
    }
];

function Home() {
    const { isAuthenticated, role } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    // Carousel Active Slide State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Real-Time Countdown Timer state for Featured Event Spotlight
    const [timeLeft, setTimeLeft] = useState({
        days: 14,
        hours: 8,
        minutes: 42,
        seconds: 15
    });

    // Auto-Play Timer for Image Carousel (advances every 5 seconds unless paused by mouse hover)
    useEffect(() => {
        if (isPaused) return;
        const slideTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 5000);
        return () => clearInterval(slideTimer);
    }, [isPaused]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
    };

    // Live countdown interval
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        } else {
                            hours = 23;
                            if (days > 0) days--;
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchPublicEvents = async () => {
            try {
                const res = await getAllEvents();
                const approved = (res.data || []).filter((e) => e.status === "APPROVED");
                setEvents(approved);
            } catch (err) {
                console.error("Failed to fetch homepage events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicEvents();
    }, []);

    const handlePortalNavigation = () => {
        if (isAuthenticated) {
            if (role === "ADMIN") navigate("/admin");
            else if (role === "STUDENT") navigate("/student");
            else navigate("/login");
        } else {
            navigate("/login");
        }
    };

    const getEventCategory = (event) => {
        const text = (event.title + " " + (event.description || "")).toLowerCase();
        if (text.includes("hackathon") || text.includes("coding") || text.includes("ai") || text.includes("iot")) {
            return { label: "HACKATHON & AI", category: "HACKATHON", color: "bg-blue-100 text-blue-900 border-blue-300" };
        }
        if (text.includes("symposium") || text.includes("research") || text.includes("conference")) {
            return { label: "RESEARCH SYMPOSIUM", category: "SYMPOSIUM", color: "bg-purple-100 text-purple-900 border-purple-300" };
        }
        if (text.includes("fair") || text.includes("career") || text.includes("internship")) {
            return { label: "CAREER & INDUSTRIAL", category: "CAREER", color: "bg-amber-100 text-amber-900 border-[#EAA91D]" };
        }
        return { label: "ACADEMIC WORKSHOP", category: "WORKSHOP", color: "bg-green-100 text-green-900 border-green-300" };
    };

    const filteredEvents = events.filter((ev) => {
        const matchesSearch =
            ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ev.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ev.description?.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedCategory === "ALL") return matchesSearch;
        const cat = getEventCategory(ev);
        if (selectedCategory === "SYMPOSIUM") return matchesSearch && cat.category === "SYMPOSIUM";
        if (selectedCategory === "HACKATHON") return matchesSearch && cat.category === "HACKATHON";
        if (selectedCategory === "CAREER") return matchesSearch && cat.category === "CAREER";
        return matchesSearch;
    });

    const activeSlideData = CAROUSEL_SLIDES[currentSlide];

    return (
        <div className="min-h-screen bg-[#F4F6F9] text-gray-900 flex flex-col font-sans overflow-x-hidden">
            <Navbar />

            {/* PRODUCTION-LEVEL ANIMATED HERO SECTION WITH IMAGE CAROUSEL */}
            <section
                className="relative bg-[#4C1414] text-white border-b-4 border-[#EAA91D] min-h-[640px] flex items-center overflow-hidden shadow-2xl"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* CAROUSEL BACKGROUND IMAGES WITH SMOOTH CROSS-FADE ANIMATION */}
                {CAROUSEL_SLIDES.map((slide, idx) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        {/* High-Res Background Image */}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                        {/* Elegant Dark Gradient Overlays for Academic Contrast */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4C1414]/95 via-[#571515]/85 to-black/60"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#4C1414] via-transparent to-black/40"></div>
                    </div>
                ))}

                {/* ANIMATED FLOATING DECORATIVE GLOWS */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#EAA91D]/15 rounded-full blur-3xl pointer-events-none animate-float z-20"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-float z-20" style={{ animationDelay: "2s" }}></div>

                {/* MAIN CAROUSEL CONTENT & LIVE SPOTLIGHT GRID */}
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-30">
                    {/* Left Carousel Text Content */}
                    <div className="lg:col-span-7 space-y-6 animate-fade-in" key={`slide-text-${currentSlide}`}>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#EAA91D]/60 text-[#EAA91D] font-extrabold text-xs uppercase tracking-wider shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#EAA91D]"></span>
                            <span>{activeSlideData.badge}</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-serif uppercase leading-tight">
                            {activeSlideData.title}
                        </h1>

                        <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-medium max-w-2xl">
                            {activeSlideData.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <button
                                onClick={handlePortalNavigation}
                                className="bg-[#EAA91D] hover:bg-[#d49615] text-[#4C1414] font-black px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 uppercase tracking-wider text-sm flex items-center gap-2 animate-pulse-glow"
                            >
                                <span>{isAuthenticated ? "Enter My Academic Portal →" : activeSlideData.ctaText}</span>
                            </button>
                            <a
                                href="#events"
                                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 hover:border-[#EAA91D] font-bold px-7 py-4 rounded-xl text-sm uppercase tracking-wider transition duration-200 backdrop-blur-sm"
                            >
                                Explore Live Catalog ↓
                            </a>
                        </div>

                        {/* Quick Interactive Highlights Bar */}
                        <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg">
                            <div>
                                <div className="text-2xl font-black text-[#EAA91D] font-serif">{events.length || 4}+</div>
                                <div className="text-xs text-gray-300 font-semibold uppercase">Active Events</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-[#EAA91D] font-serif">100%</div>
                                <div className="text-xs text-gray-300 font-semibold uppercase">Verified Access</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-[#EAA91D] font-serif">Live</div>
                                <div className="text-xs text-gray-300 font-semibold uppercase">Seat Allocation</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Featured Event Spotlight with LIVE COUNTDOWN TIMER */}
                    <div className="lg:col-span-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        <div className="bg-white/95 backdrop-blur-md text-gray-900 rounded-2xl p-6 shadow-2xl border-2 border-[#EAA91D] relative overflow-hidden group hover:shadow-3xl transition duration-300">
                            {/* Decorative Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded bg-[#6B1D1D] text-[#EAA91D] text-xs font-black uppercase tracking-wider">
                                        ★ LIVE COUNTDOWN
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-gray-500 font-mono">
                                    2026 ACADEMIC YEAR
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-[#6B1D1D] font-serif leading-snug mb-2">
                                University of Ruhuna - FOT Annual Research Symposium 2026
                            </h3>
                            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                                Join leading engineering technologists, ICT researchers, and guest speakers for Southern Sri Lanka's premier university research symposium.
                            </p>

                            {/* LIVE COUNTDOWN TIMER */}
                            <div className="bg-[#4C1414] text-white rounded-xl p-4 mb-5 border border-[#EAA91D]/40">
                                <div className="text-xs font-bold text-[#EAA91D] uppercase tracking-wider text-center mb-2">
                                    Keynote Session Starts In:
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="bg-black/30 rounded-lg py-2">
                                        <div className="text-2xl font-black font-mono text-[#EAA91D]">
                                            {String(timeLeft.days).padStart(2, "0")}
                                        </div>
                                        <div className="text-[10px] text-gray-300 uppercase font-semibold">Days</div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg py-2">
                                        <div className="text-2xl font-black font-mono text-[#EAA91D]">
                                            {String(timeLeft.hours).padStart(2, "0")}
                                        </div>
                                        <div className="text-[10px] text-gray-300 uppercase font-semibold">Hours</div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg py-2">
                                        <div className="text-2xl font-black font-mono text-[#EAA91D]">
                                            {String(timeLeft.minutes).padStart(2, "0")}
                                        </div>
                                        <div className="text-[10px] text-gray-300 uppercase font-semibold">Mins</div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg py-2">
                                        <div className="text-2xl font-black font-mono text-[#EAA91D]">
                                            {String(timeLeft.seconds).padStart(2, "0")}
                                        </div>
                                        <div className="text-[10px] text-gray-300 uppercase font-semibold">Secs</div>
                                    </div>
                                </div>
                            </div>

                            {/* Live Capacity Gauge */}
                            <div className="mb-5 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-gray-700">Undergraduate Enrolled Seats</span>
                                    <span className="text-[#6B1D1D]">165 / 200 Allocated (82%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-[#6B1D1D] h-2.5 rounded-full" style={{ width: "82%" }}></div>
                                </div>
                            </div>

                            <button
                                onClick={handlePortalNavigation}
                                className="w-full bg-[#6B1D1D] hover:bg-[#571515] text-white font-black py-3 px-4 rounded-lg uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
                            >
                                <span>Reserve My Undergraduate Seat →</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* CAROUSEL CONTROLS & SLIDE INDICATORS */}
                <div className="absolute bottom-6 left-0 right-0 z-40 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
                    {/* Slide Indicators (Clickable Pills) */}
                    <div className="flex items-center gap-3">
                        {CAROUSEL_SLIDES.map((slide, idx) => (
                            <button
                                key={slide.id}
                                onClick={() => setCurrentSlide(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-3 rounded-full transition-all duration-300 ${
                                    idx === currentSlide
                                        ? "w-10 bg-[#EAA91D] shadow-md"
                                        : "w-3 bg-white/40 hover:bg-white/70"
                                }`}
                            ></button>
                        ))}
                    </div>

                    {/* Manual Previous / Next Arrow Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={prevSlide}
                            aria-label="Previous Slide"
                            className="w-10 h-10 rounded-full bg-black/40 hover:bg-[#6B1D1D] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition duration-200 shadow-md hover:scale-110"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            aria-label="Next Slide"
                            className="w-10 h-10 rounded-full bg-black/40 hover:bg-[#6B1D1D] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition duration-200 shadow-md hover:scale-110"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* PROFESSIONAL FOT ACADEMIC DEPARTMENTS WITH HIGH-RES PHOTOGRAPHIC CARDS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#EAA91D] block mb-1">
                        OFFICIAL FACULTY TRACKS &amp; SYMPOSIA
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#6B1D1D] tracking-tight font-serif uppercase">
                        Faculty of Technology — Academic Departments
                    </h2>
                    <div className="w-16 h-1 bg-[#EAA91D] mx-auto mt-2 rounded-full mb-3"></div>
                    <p className="text-gray-600 text-sm font-medium">
                        Explore research symposium tracks, technological exhibitions, and industry linkages hosted by FOT academic departments at University of Ruhuna.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ACADEMIC_DEPARTMENTS.map((dept) => (
                        <div
                            key={dept.id}
                            onClick={() => {
                                setSelectedCategory(dept.filterCategory);
                                document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="bg-white border border-gray-200 hover:border-[#EAA91D] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                        >
                            <div>
                                {/* Professional Photographic Header WITHOUT Badges */}
                                <div className="relative h-52 w-full overflow-hidden bg-gradient-to-r from-[#4C1414] to-[#6B1D1D]">
                                    <img
                                        src={dept.image}
                                        alt={dept.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    {/* Elegant dark gradient overlay for smooth contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                </div>

                                {/* Text Content */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-[#6B1D1D] mb-2 font-serif group-hover:text-[#571515] transition">
                                        {dept.name}
                                    </h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {dept.description}
                                    </p>
                                </div>
                            </div>

                            {/* Footer CTA */}
                            <div className="px-6 pb-6 pt-2">
                                <div className="text-xs font-bold text-[#6B1D1D] group-hover:text-[#EAA91D] transition-colors flex items-center justify-between border-t border-gray-100 pt-3">
                                    <span>{dept.ctaText}</span>
                                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* NATIONAL UNIVERSITY STYLE UPCOMING EVENTS (HORIZONTAL SCHEDULE TICKER) */}
            <section className="bg-white border-t border-gray-200 py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    {/* Header with Horizontal Divider Line */}
                    <div className="flex items-center justify-between pb-3 mb-8 border-b border-gray-300">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#6B1D1D] tracking-tight font-serif uppercase">
                            Upcoming Events
                        </h2>
                        <a
                            href="#events"
                            className="text-xs font-extrabold text-[#6B1D1D] hover:text-[#EAA91D] uppercase tracking-wider transition-colors flex items-center gap-1"
                        >
                            <span>View All Events</span>
                            <span>→</span>
                        </a>
                    </div>

                    {/* Horizontal Upcoming Events with Image Thumbnails & Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(events.length > 0 ? events.slice(0, 3) : CAMPUS_AGENDA).map((item, idx) => {
                            const dateObj = item.eventDate ? new Date(item.eventDate) : null;
                            const dayStr = dateObj
                                ? String(dateObj.getDate()).padStart(2, "0")
                                : item.dateDay || "06";
                            const monthStr = dateObj
                                ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase()
                                : item.dateMonth || "AUG";
                            const timeStr = dateObj
                                ? dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                                : item.time || "09:00 AM — 11:30 AM";
                            const venueStr = item.location || item.venue || "FOT Main Auditorium";
                            const imageSrc =
                                item.imageUrl ||
                                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lecture_hall_of_the_University_of_Helsinki.jpg/800px-Lecture_hall_of_the_University_of_Helsinki.jpg";

                            return (
                                <div
                                    key={item.id || idx}
                                    onClick={handlePortalNavigation}
                                    className="flex items-start gap-3.5 p-4 rounded-xl hover:bg-gray-50 transition border border-gray-200/60 hover:border-[#6B1D1D]/40 group cursor-pointer shadow-xs hover:shadow-md"
                                >
                                    {/* Left: Big Maroon Date Badge */}
                                    <div className="text-center flex-shrink-0 w-12 border-b-2 border-[#6B1D1D] pb-1.5">
                                        <div className="text-2xl font-black text-[#6B1D1D] leading-none font-serif">
                                            {dayStr}
                                        </div>
                                        <div className="text-[10px] font-extrabold text-gray-700 uppercase tracking-wider mt-1">
                                            {monthStr}
                                        </div>
                                    </div>

                                    {/* Middle: Event Photo Thumbnail */}
                                    <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#4C1414] shadow-sm border border-gray-200">
                                        <img
                                            src={imageSrc}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    </div>

                                    {/* Right: Event Title, Time & Venue */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#6B1D1D] leading-snug mb-1 font-serif transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
                                            <span>🕒 {timeStr}</span>
                                        </p>
                                        <p className="text-[11px] font-bold text-[#6B1D1D] truncate mt-0.5">
                                            📍 {venueStr}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* NATIONAL UNIVERSITY STYLE UPCOMING COURSES & SYMPOSIA (3-COLUMN PHOTOGRAPHIC CARDS) */}
            <section id="events" className="py-16 bg-[#F4F6F9]">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    {/* Header with Horizontal Divider Line */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-3 mb-10 border-b border-gray-300">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#6B1D1D] tracking-tight font-serif uppercase">
                                Upcoming Courses &amp; Symposia
                            </h2>
                            <p className="text-gray-600 text-sm mt-1 font-medium">
                                Official University of Ruhuna Faculty of Technology (FOT) academic event catalog.
                            </p>
                        </div>

                        {/* Quick Search Input */}
                        <div className="relative w-full md:w-80">
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
                                placeholder="Search events & courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#6B1D1D] focus:ring-2 focus:ring-[#6B1D1D]/20 transition shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Category Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mb-10">
                        {[
                            { id: "ALL", label: "All Events & Courses" },
                            { id: "SYMPOSIUM", label: "Research Symposia" },
                            { id: "HACKATHON", label: "Coding Hackathons & AI" },
                            { id: "CAREER", label: "Industrial Career Fairs" }
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 ${
                                    selectedCategory === cat.id
                                        ? "bg-[#6B1D1D] text-white shadow-md scale-105"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Events Grid modeled after National University Photographic Cards */}
                    {loading ? (
                        <div className="py-16 text-center text-gray-500 font-medium">
                            Loading official university event catalog...
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="bg-white border border-gray-300 rounded-xl p-12 text-center text-gray-500 font-medium">
                            No events matching your search or category filter. Try selecting "All Events & Courses" above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((ev) => {
                                const formattedDate = ev.eventDate
                                    ? new Date(ev.eventDate).toLocaleString("en-US", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric"
                                      })
                                    : "DATE TBA";

                                const count = ev.registrations ? ev.registrations.length : 0;
                                const capacity = ev.capacity || 100;
                                const percentage = Math.min(Math.round((count / capacity) * 100), 100);
                                const isFull = count >= capacity;
                                const catInfo = getEventCategory(ev);

                                return (
                                    <div
                                        key={ev.id}
                                        onClick={handlePortalNavigation}
                                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Photographic Banner Box with Golden Emblem Badge & Maroon Overlay */}
                                            <div className="relative h-60 w-full overflow-hidden bg-[#4C1414]">
                                                <img
                                                    src={
                                                        ev.imageUrl ||
                                                        (catInfo.category === "SYMPOSIUM"
                                                            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lecture_hall_of_the_University_of_Helsinki.jpg/800px-Lecture_hall_of_the_University_of_Helsinki.jpg"
                                                            : catInfo.category === "HACKATHON"
                                                            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/CERN_Server_03.jpg/800px-CERN_Server_03.jpg"
                                                            : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Science_laboratory_%2827926131378%29.jpg/800px-Science_laboratory_%2827926131378%29.jpg")
                                                    }
                                                    alt={ev.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                    }}
                                                />
                                                {/* Rich Dark Maroon Gradient Overlay at bottom */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#4C1414] via-[#4C1414]/70 to-transparent"></div>

                                                {/* Golden University Emblem Seal Badge at top-right */}
                                                <div
                                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#EAA91D] border-2 border-white shadow-lg flex items-center justify-center text-[#4C1414] font-black text-xs"
                                                    title="University of Ruhuna FOT Official"
                                                >
                                                    ★
                                                </div>

                                                {/* Title & Academic Year overlaid on bottom of photo */}
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="text-white font-black text-lg sm:text-xl uppercase leading-snug drop-shadow-md font-serif line-clamp-2">
                                                        {ev.title}
                                                    </h3>
                                                    <p className="text-[#EAA91D] text-xs mt-1 font-bold tracking-wider uppercase">
                                                        2026/2027 ACADEMIC YEAR
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Below the Photo: Clean Date & Metadata Line */}
                                            <div className="p-6">
                                                <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                                                    {formattedDate} / {catInfo.label}
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#6B1D1D] transition font-serif mb-2 line-clamp-2">
                                                    {ev.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                    {ev.description}
                                                </p>

                                                {/* Capacity Progress & Action */}
                                                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                                    <span className={isFull ? "text-red-600 font-extrabold" : "text-[#6B1D1D] font-bold"}>
                                                        {count} / {capacity} Enrolled ({percentage}%)
                                                    </span>
                                                    <span className="font-extrabold text-[#6B1D1D] group-hover:text-[#EAA91D] transition-colors flex items-center gap-1">
                                                        <span>Register Now</span>
                                                        <span>→</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* PRODUCTION-LEVEL INSTITUTIONAL SHOWCASE BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
                <div className="bg-gradient-to-r from-[#4C1414] via-[#5A1414] to-[#6B1D1D] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#EAA91D] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
                    <div className="lg:col-span-7 space-y-4 relative z-10">
                        <span className="text-[#EAA91D] text-xs font-black uppercase tracking-widest">
                            SRI LANKA'S PREMIER TECHNOLOGY FACULTY
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black font-serif uppercase tracking-wide">
                            Faculty of Technology (FOT) — University of Ruhuna
                        </h2>
                        <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-medium">
                            Established at the University of Ruhuna, FOT stands at the forefront of higher technological education in Sri Lanka—producing skilled technologists in Engineering Technology, ICT, and Biosystems Technology.
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={handlePortalNavigation}
                                className="bg-[#EAA91D] hover:bg-white text-[#4C1414] hover:text-[#6B1D1D] font-black px-7 py-3 rounded-xl uppercase tracking-wider text-xs shadow-md transition duration-200"
                            >
                                Enter University Portal →
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center hover:border-[#EAA91D] transition">
                            <div className="text-3xl sm:text-4xl font-black text-[#EAA91D] font-serif">3+</div>
                            <div className="text-xs text-gray-300 font-bold uppercase mt-1">Departments</div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center hover:border-[#EAA91D] transition">
                            <div className="text-3xl sm:text-4xl font-black text-[#EAA91D] font-serif">1500+</div>
                            <div className="text-xs text-gray-300 font-bold uppercase mt-1">Undergraduates</div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center hover:border-[#EAA91D] transition">
                            <div className="text-3xl sm:text-4xl font-black text-[#EAA91D] font-serif">100%</div>
                            <div className="text-xs text-gray-300 font-bold uppercase mt-1">Admin Verified</div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center hover:border-[#EAA91D] transition">
                            <div className="text-3xl sm:text-4xl font-black text-[#EAA91D] font-serif">2026</div>
                            <div className="text-xs text-gray-300 font-bold uppercase mt-1">Academic Year</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OFFICIAL UNIVERSITY FOOTER */}
            <footer className="bg-[#4C1414] text-white text-xs py-10 px-6 border-t border-[#EAA91D]/40">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8 text-left">
                    <div className="sm:col-span-2">
                        <div className="flex items-center gap-2 text-sm font-black text-[#EAA91D] uppercase tracking-wider mb-3 font-serif">
                            <span>★ UNIVERSITY OF RUHUNA — FOT</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-xs max-w-sm">
                            Faculty of Technology (FOT), Karagoda Uyangoda, Kamburupitiya, Sri Lanka. Providing world-class higher education in Engineering Technology, ICT, and Biosystems.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#EAA91D] uppercase text-xs mb-3 tracking-wider font-serif">
                            Portal Navigation
                        </h4>
                        <ul className="space-y-2 text-gray-300 text-xs">
                            <li><a href="#events" className="hover:text-white transition">Upcoming Event Catalog</a></li>
                            <li><span onClick={handlePortalNavigation} className="hover:text-white cursor-pointer transition">Academic Portal Login</span></li>
                            <li><span onClick={handlePortalNavigation} className="hover:text-white cursor-pointer transition">Student Directory Notice</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#EAA91D] uppercase text-xs mb-3 tracking-wider font-serif">
                            RBAC Security
                        </h4>
                        <p className="text-gray-300 leading-relaxed text-xs">
                            Undergraduate access is provisioned exclusively by University Administration. Self-registration is disabled for public users.
                        </p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-center text-gray-400">
                    <p className="font-medium">
                        © 2026 University of Ruhuna, Sri Lanka — Faculty of Technology (FOT). All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
