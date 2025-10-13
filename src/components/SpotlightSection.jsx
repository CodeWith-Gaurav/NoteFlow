// components/SpotlightSection.jsx (REFRESHED)
import React, { useRef, useEffect, useCallback } from 'react';
import FeatureBlock from './FeatureBlock';
import useLenisScroll from '../hooks/useLenisScroll'; // Assuming this hook is available
import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton } from '@clerk/clerk-react';

// Sample data for NoteFlow features
const FEATURE_DATA = [
    { id: 1, title: "Flow", pos: { top: 25, left: 15 }, description: "Generate precise knowledge graphs from notes.", imageUrl: "/images/flow.png" },
    { id: 2, title: "Signal", pos: { top: 12.5, left: 50 }, description: "Automatic detection of key insights.", imageUrl: "/images/signal.png" },
    { id: 3, title: "System Design", pos: { top: 22.5, left: 75 }, description: "Design complex systems visually.", imageUrl: "/images/system-design.png" },
    { id: 4, title: "Archive", pos: { top: 30, left: 82.5 }, description: "A unified, searchable repository.", imageUrl: "/images/archive.png" },
    { id: 5, title: "Versatile", pos: { top: 50, left: 20 }, description: "Seamlessly ingest data from PDF, text, and audio.", imageUrl: "/images/versatile.png" },
    { id: 6, title: "Text-Audiobook", pos: { top: 80, left: 20 }, description: "Convert infographics into high-quality audiobooks.", imageUrl: "/images/audiobook.png" },
    { id: 7, title: "Collaboration", pos: { top: 75, left: 75 }, description: "Real-time co-editing of knowledge maps.", imageUrl: "/images/collaboration.png" },
];

const SpotlightSection = ({ isDarkMode }) => {
    useLenisScroll(); // Initialize Lenis smooth scrolling
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    const spotlightRef = useRef(null);
    const ctaButtonMorphTargetRef = useRef(null); // The new morph target
    const headerContentRef = useRef(null);
    const featuresRef = useRef([]);

    const handleGetStarted = () => {
        if (!isSignedIn) {
            document.getElementById('spotlight-sign-in-trigger').click();
        } else {
            navigate('/generate');
        }
    };
    
    // --- GSAP Animation Logic ---
    useEffect(() => {
        if (!window.gsap || !window.ScrollTrigger) return;
        
        const spotlightEl = spotlightRef.current;
        const features = featuresRef.current;

        // --- 1. Initial Setup and Dimensions ---
        features.forEach((feature, index) => {
            const pos = FEATURE_DATA[index].pos;
            window.gsap.set(feature, { top: `${pos.top}%`, left: `${pos.left}%` });
        });

        const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
        // Target dimensions of the final CTA button (3rem height, 18rem width based on your desired look)
        const targetWidthRem = 18; 
        const targetHeightRem = 3.5;
        
        // Define initial feature block background dimensions (must match CSS)
        const featureStartDimensions = features.map(feature => {
            const bg = feature.querySelector('.feature-bg');
            const rect = bg.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
        });

        // Set initial state for the final header (which is controlled by the animation)
        window.gsap.set(headerContentRef.current, { y: -100, opacity: 0 });

        const handleResize = () => window.ScrollTrigger.refresh();
        window.addEventListener("resize", handleResize);

        // --- 2. ScrollTrigger Timeline Creation ---
        
        const tl = window.gsap.timeline({
            scrollTrigger: {
                trigger: spotlightEl,
                start: "top top",
                end: `+=${window.innerHeight * 3}px`,
                pin: true,
                pinSpacing: true,
                scrub: 1,
            },
        });

        // PHASE 1: Spotlight Header Exit (Progress 0 to 0.33)
        tl.to(".spotlight-content h1", {
            y: '-100%',
        }, 0); 
        
        // PHASE 2: Feature Morphing (Progress 0 to 0.5)
        features.forEach((feature) => {
            const featureBg = feature.querySelector('.feature-bg');
            const featureContent = feature.querySelector('.feature-content');

            // Move feature position to the center (50%, 50%)
            tl.to(feature, {
                top: '50%',
                left: '50%',
                ease: 'power1.inOut',
            }, 0);

            // Animate feature background (morphing to the target size/shape)
            // Note: The blocks should shrink before becoming the final CTA shape
            tl.to(featureBg, {
                width: remInPixels * 3, // Smaller circle
                height: remInPixels * 3, // Smaller circle
                borderRadius: '50%',
                borderWidth: '0.25rem',
                ease: 'power1.inOut',
            }, 0);
            
            // Fade out the initial text content
            tl.to(featureContent, {
                opacity: 0,
            }, 0);
        });

        // PHASE 3: Final CTA Morph and Reveal (Progress 0.5 to 0.75)
        
        // The individual features have now converged. Fade them out and fade in the final CTA container.
        tl.to(".features", { 
            opacity: 0, 
            scale: 0.8 // Optional: shrink the converged dots slightly
        }, 0.5); 
        
        // Final CTA appearance and expansion
        tl.fromTo(ctaButtonMorphTargetRef.current, {
            opacity: 0, // Starts invisible
            scale: 0.5, // Starts small
            width: remInPixels * 3,
            height: remInPixels * 3,
            borderRadius: '50%',
        }, {
            opacity: 1, // Becomes fully visible
            scale: 1, // Grows to full size
            width: `${targetWidthRem}rem`, // Expands horizontally
            height: `${targetHeightRem}rem`, // Expands vertically
            borderRadius: '25rem', // Becomes pill-shaped
            ease: 'power1.inOut',
        }, 0.5); 

        // PHASE 4: Final Header/CTA Banner Reveal (Progress 0.75 to 1.0)
        tl.to(ctaButtonMorphTargetRef.current.querySelector('span'), {
            opacity: 1, // Text appears
            ease: 'power1.out',
        }, 0.75);

        tl.to(headerContentRef.current, {
            y: 0, // Moves header into view
            opacity: 1,
            ease: 'power1.out',
        }, 0.75);
        
        // Cleanup ScrollTrigger and event listener
        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            window.removeEventListener("resize", handleResize);
        };

    }, [isDarkMode]); // Dependency on dark mode to re-calculate colors

    // Dynamic classes for dark/light mode
    const headerClass = isDarkMode ? 'text-white' : 'text-gray-900';
    const spotlightBgClass = isDarkMode ? 'opacity-25' : 'opacity-10';

    return (
        <section ref={spotlightRef} className={`spotlight relative w-full h-[300vh] overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            
            {/* 1. Initial Header */}
            <div className="spotlight-content absolute inset-0 flex justify-center items-center will-change-transform">
                <div className={`spotlight-bg absolute transform scale-80 ${spotlightBgClass}`}>
                    <img src="/mesh.png" alt="Background Mesh" className='w-full h-full object-cover' />
                </div>
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-serif w-4/5 ${headerClass}`}>Information flows best through intentional design.</h1>
            </div>

            {/* 2. Final Header (CTA Banner Reveal) */}
            <div className="header absolute inset-0 flex justify-center items-center">
                <div ref={headerContentRef} className={`header-content w-full md:w-3/5 flex flex-col items-center text-center gap-8 will-change-transform ${headerClass}`}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif">Find what matters through intelligent design</h1>
                    <p className="text-base md:text-lg">
                        Stop wading through scattered notes and transform your raw data into actionable knowledge maps instantly.
                    </p>
                </div>
            </div>

            {/* 3. Feature Blocks Container (The scattering elements) */}
            <div className="features absolute inset-0">
                {FEATURE_DATA.map((feature, index) => (
                    <FeatureBlock 
                        key={feature.id}
                        title={feature.title}
                        description={feature.description}
                        imageUrl={feature.imageUrl}
                        isDarkMode={isDarkMode}
                        ref={el => (featuresRef.current[index] = el)}
                    />
                ))}
            </div>

            {/* 4. CTA Button (The Morph Target) */}
            <div 
                ref={ctaButtonMorphTargetRef} 
                onClick={handleGetStarted}
                className={`morph-cta-target absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           bg-primary border-4 flex items-center justify-center cursor-pointer 
                           opacity-0 will-change-transform transition-colors duration-500`}>
                <span className={`text-white text-lg font-medium opacity-0`}>Get Started Now</span>
            </div>

            {/* Hidden Sign-In Trigger */}
            <div className='hidden'>
                <SignInButton mode='modal'>
                    <button id="spotlight-sign-in-trigger"></button>
                </SignInButton>
            </div>
        </section>
    );
};

export default SpotlightSection;