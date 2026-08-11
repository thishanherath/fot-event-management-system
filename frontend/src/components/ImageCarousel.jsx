import React, { useState, useEffect } from 'react';

// Import images from the assets folder
import event1 from '../assets/event1.jpg';
import event2 from '../assets/event2.jpg';
import campus from '../assets/campus.jpg';

/**
 * ImageCarousel Component
 * 
 * A reusable image carousel with a black gradient shade and text overlay.
 * 
 * HOW TO ADD IMAGES:
 * 1. Place your image files (e.g., 'slide1.jpg', 'slide2.png') into the `frontend/public/` folder 
 *    or the `frontend/src/assets/` folder.
 * 2. If using the `public` folder, you can reference them directly by name like `/slide1.jpg`.
 * 3. Pass the images array to this component as a prop.
 */

const DEFAULT_SLIDES = [
    {
        id: 1,
        image: event1,
        title: "Welcome to Event Management",
        subtitle: "Organize and manage your university events seamlessly."
    },
    {
        id: 2,
        image: event2,
        title: "Engage with the Community",
        subtitle: "Join hackathons, symposia, and cultural events."
    },
    {
        id: 3,
        image: campus,
        title: "Empowering Students",
        subtitle: "A platform built for the Faculty of Technology."
    }
];

function ImageCarousel({ slides = DEFAULT_SLIDES, autoPlayInterval = 5000 }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, autoPlayInterval);
        return () => clearInterval(timer);
    }, [slides.length, autoPlayInterval]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    {/* Background Image */}
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Black Shade (Gradient Overlay) */}
                    <div className="absolute inset-0 bg-black/10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
                        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg tracking-tight font-serif transform transition-transform duration-700 translate-y-0">
                            {slide.title}
                        </h2>
                        <p className="text-base sm:text-xl text-gray-200 max-w-2xl drop-shadow-md">
                            {slide.subtitle}
                        </p>
                    </div>
                </div>
            ))}

            {/* Navigation Controls (Arrows) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white hover:bg-black/20 rounded-full transition-all"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white hover:bg-black/20 rounded-full transition-all"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Slide Indicators (Dots) */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                        }`}
                    ></button>
                ))}
            </div>
        </div>
    );
}

export default ImageCarousel;
