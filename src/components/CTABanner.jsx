/* eslint-disable react/no-unknown-property */
import React, { forwardRef, useRef, useMemo, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Prism from './Prism';


// --- MAIN COMPONENT ---
const CTABanner = ({ theme }) => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (!isSignedIn) {
            const signInButton = document.getElementById('cta-sign-in-trigger');
            if (signInButton) signInButton.click();
        } else {
            navigate('/generate');
        }
    };

    const variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
    const buttonClasses =
        'bg-primary text-white px-8 py-3 rounded-full cursor-pointer hover:scale-105 transition-all shadow-lg shadow-primary/50 text-sm font-medium';

    return (
        <motion.section
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative py-20 overflow-hidden min-h-[300px]"
        >
            {/* 1. Background (REPLACED Silk with Prism) */}
            <div className="absolute inset-0 z-0 min-h-[300px]">
                {/* 🛑 REMOVED: <Silk speed={2} scale={2.0} color="rgb(66, 123, 255)" noiseIntensity={1.0} rotation={0.5} /> */}
                <Prism
                    animationType="3drotate" // Changed to 3drotate for smooth, automatic animation
                    timeScale={0.25}      // Slowed down slightly
                    height={3.5}
                    baseWidth={5.5}
                    scale={3.6}
                    hueShift={0.7}        // Increased shift for better color range
                    colorFrequency={1}
                    noise={0.5}
                    glow={1}
                />
            </div>

            {/* 2. Overlay (REMOVED: The gradient thing) */}
            {/* 🛑 REMOVED: <div className="absolute inset-0 bg-black/40 z-[5] pointer-events-none"></div> */}

            {/* 3. Content */}
            <div className={`relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-12 ${textColor}`}>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                    Transform your notes into Infographics now.
                </h2>


                <p className="text-lg font-medium opacity-90 mb-8 max-w-2xl mx-auto">
                    Stop writing notes and start creating knowledge. Ready to streamline your study process?
                </p>

                {/* ✅ Get Started Button */}
                <div onClick={handleGetStarted} className={`inline-flex items-center justify-center ${buttonClasses}`}>
                    Get Started Now
                </div>

                {/* Hidden Sign-In Trigger */}
                <div className="hidden">
                    <SignInButton mode="modal">
                        <button id="cta-sign-in-trigger"></button>
                    </SignInButton>
                </div>
            </div>
        </motion.section>
    );
};

export default CTABanner;
