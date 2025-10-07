// src/components/Preloader.jsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import './../assets/Loader.css'; 
import { useUser } from '@clerk/clerk-react';

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

const Preloader = ({ onLoaderComplete }) => {
    
    const loaderRef = useRef(null); 
    const { isLoaded } = useUser(); 

    useEffect(() => {
        if (!isLoaded || !loaderRef.current) {
            return;
        }
        
        // Use gsap.context for better cleanup
        const ctx = gsap.context(() => {

            const tl = gsap.timeline({
                delay: 0.3,
                defaults: {
                    ease: "hop",
                },
                onComplete: () => {
                    setTimeout(onLoaderComplete, 500);
                }
            });

            const counts = gsap.utils.toArray(".count");
            
            // ⭐️ FIX 1: Set initial opacity for digits right at the start
            // This prevents the '00' from flashing before the animation starts.
            tl.set(".count .digit h1", { opacity: 1, duration: 0 }); 

            // ==========================================================
            // 1. Counter Animation (Digits animate 0 -> 100)
            // ==========================================================
            let counterDuration = 0;

            counts.forEach((count, index) => {
                const digits = count.querySelectorAll(".digit h1");
                
                // Animation to 0% (up)
                tl.to(digits, { y: "0%", duration: 1, stagger: 0.075, }, index * 1);
                
                // Animation to -100% (down, simulating next number)
                // We calculate the end time of the counter here.
                if (index < counts.length) {
                    // Staggered end time for the final count animation
                    counterDuration = index * 1 + 1 + 1; 
                    tl.to(digits, { y: "-100%", duration: 1, stagger: 0.075, }, index * 1 + 1);
                }
            });

            // ⭐️ FIX 2: Set initial opacity for "Note Flow" only AFTER the counter finishes
            // This prevents the text from showing up prematurely.
            tl.set(".word h1", { opacity: 1, duration: 0 }, counterDuration || 5); // Use the calculated duration, or a safe fallback like 5s


            // 2. Spinner Fade Out
            // Start fading out the spinner slightly before the logo reveals
            tl.to(".spinner", { opacity: 0, duration: 0.3, }, counterDuration - 1); // e.g., 1 second before counter finishes


            // ==========================================================
            // 3. Logo (NoteFlow) reveal - Now controlled to start AFTER counter
            // ==========================================================
            // Position the logo animation precisely after the counter ends (at 'counterDuration' time)
            tl.to(".word h1", { y: "0%", duration: 1.2, }, counterDuration); 

            // 4. Divider Scale Up and Fade Out
            // Start the divider slightly after the logo reveal begins
            tl.to(".divider", {
                scaleY: "100%",
                duration: 1,
                // Use a relative position to start this when the logo is about halfway in
            }, counterDuration + 0.5); 
            
            // Fade out the divider immediately after it finishes scaling up
            tl.to(".divider", { opacity: 0, duration: 0.4, delay: 0.3 }); 


            // 5. Logo (NoteFlow) Exit
            tl.to("#word-1 h1", { y: "100%", duration: 1, delay: 0.3 });
            tl.to("#word-2 h1", { y: "-100%", duration: 1, }, "<");

            // 6. Blocks Wipe Away (The Main Transition)
            tl.to(".block", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                duration: 1,
                stagger: 0.1,
                delay: 0.75,
            });

        }, loaderRef); 

        return () => ctx.revert(); 
    }, [isLoaded, onLoaderComplete]);


    return (
        <div ref={loaderRef} className="loader fixed inset-0 z-[9999]">
            
            <div className="overlay">
                <div className="block"></div>
                <div className="block"></div>
            </div>
            
            <div className="intro-logo">
                <div className="word" id="word-1">
                    {/* ⭐️ REMOVE inline opacity-0 class here since we rely on CSS and GSAP.set */}
                    <h1><span>Note</span></h1> 
                </div>
                <div className="word" id="word-2">
                    {/* ⭐️ REMOVE inline opacity-0 class here since we rely on CSS and GSAP.set */}
                    <h1>Flow</h1>
                </div>
            </div>

            <div className="divider"></div>

            <div className="spinner-container">
                <div className="spinner"></div>
            </div>

            <div className="counter">
                {/* ... (Counter digits structure remains the same) ... */}
                <div className="count">
                    <div className="digit"><h1>0</h1></div>
                    <div className="digit"><h1>0</h1></div>
                </div>
                <div className="count">
                    <div className="digit"><h1>2</h1></div>
                    <div className="digit"><h1>7</h1></div>
                </div>
                <div className="count">
                    <div className="digit"><h1>6</h1></div>
                    <div className="digit"><h1>5</h1></div>
                </div>
                <div className="count">
                    <div className="digit"><h1>9</h1></div>
                    <div className="digit"><h1>8</h1></div>
                </div>
                <div className="count">
                    <div className="digit"><h1>9</h1></div>
                    <div className="digit"><h1>9</h1></div>
                </div>
            </div>
        </div>
    );
}

export default Preloader;