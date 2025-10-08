// src/components/Hero.jsx
import React from 'react'
import assets from '../assets/assets'
// ⭐️ CORRECTION: Use standard framer-motion library (assuming it's installed)
import { motion } from "framer-motion"
import { Link } from 'react-router-dom'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
// ⭐️ IMPORT THE NEW PARTICLES COMPONENT
import Particles from './Particles'


const PARTICLE_COLORS_DARK = ['#5044E5', '#4d8cea', '#ffffff']; // Violet, Blue, White
const PARTICLE_COLORS_LIGHT = ['#5044E5', '#4d8cea', '#000000']; // Violet, Blue, Black (for contrast)
// ⭐️ ACCEPT THE PROP
const Hero = ({ isEntranceAnimationComplete, theme = 'dark' }) => {
    const { isSignedIn } = useUser()
    const navigate = useNavigate()

    // ⭐️ Define a single transition object for smooth movement
    const transition = { duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 80 }

    // ⭐️ Define Variants for the Trust Badge (Delay 0.3)
    const badgeVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { ...transition, delay: 0.3 } }
    }

    // ⭐️ Define Variants for the Main Heading (Delay 0.5)
    const headingVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { ...transition, delay: 0.5 } }
    }

    // ⭐️ Define Variants for the Subheading/Paragraph (Delay 0.7)
    const paragraphVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { ...transition, delay: 0.7 } }
    }

    // ⭐️ Define Variants for the CTA Button and Hero Image (Delay 0.9)
    const ctaVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { ...transition, delay: 1.0 } }
    }

    const handleGetStarted = (e) => {
        if (!isSignedIn) {
            const signInButton = document.getElementById('hero-sign-in-trigger');
            if (signInButton) {
                signInButton.click();
            }
        } else {
            navigate('/generate');
        }
    }

    // ⭐️ Helper function for the animate prop
    const animateState = isEntranceAnimationComplete ? "visible" : "hidden";

    const particleColors = theme === 'dark' ? PARTICLE_COLORS_DARK : PARTICLE_COLORS_LIGHT;

    return (
        <div id='hero' className='relative flex flex-col items-center gap-6 py-20 px-4 sm:px-12 lg:px-24 xl:px-40 text-center w-full overflow-hidden text-gray-700 dark:text-white'>


            <div className='absolute inset-0 z-0 h-full w-full pointer-events-none'>
                <Particles
                    particleColors={particleColors}
                    particleCount={300} // Slightly more for visual impact
                    particleSpread={10}
                    speed={0.3} // Slightly faster movement
                    particleBaseSize={100}
                    moveParticlesOnHover={true} // Disable hover to avoid complexity
                    alphaParticles={true}
                    disableRotation={true} // Keep background subtle
                />
            </div>
            {/* ⭐️ 2. CONTENT CONTAINER (FOREGROUND LAYER) */}
            <div className='relative z-10 w-full flex flex-col items-center gap-6'>

                {/* 1. TRUST BADGE */}
                <motion.div
                    variants={badgeVariants}
                    initial="hidden"
                    animate={animateState} // ⭐️ CONTROLLED ANIMATION
                    className='inline-flex items-center gap-2 border border-gray-300 p-1.5 pr-4 rounded-full'>
                    <img className='w-20' src={assets.group_profile} alt="" />
                    <p className='text-xs font-medium'>Trusted by Learners & Innovators</p>
                </motion.div>

                {/* 2. MAIN HEADING */}
                <motion.h1
                    variants={headingVariants}
                    initial="hidden"
                    animate={animateState} // ⭐️ CONTROLLED ANIMATION
                    className='text-4xl sm:text-5xl md:text-6xl xl:text-[84px] font-medium xl:leading-[95px] max-w-5xl'>Transform Notes into Smart <span className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent'>Infographics</span>.</motion.h1>

                {/* 3. SUBHEADING/PARAGRAPH */}
                <motion.p
                    variants={paragraphVariants}
                    initial="hidden"
                    animate={animateState} // ⭐️ CONTROLLED ANIMATION
                    className='text-sm sm:text-lg font-medium text-gray-500 dark:text-white/75 max-w-4/5 sm:max-w-lg pb-3'>Turn scattered ideas into structured knowledge.NoteFlow brings clarity to your thinking.</motion.p>

                {/* 4. CTA BUTTON */}
                <motion.div
                    variants={ctaVariants}
                    initial="hidden"
                    animate={animateState} // ⭐️ CONTROLLED ANIMATION
                >

                    <div
                        onClick={handleGetStarted}
                        className='text-sm flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full cursor-pointer hover:scale-105 transition-all shadow-lg shadow-primary/50'>
                        Get Started Now
                    </div>
                </motion.div>
                <div className='hidden'>
                    <SignInButton mode='modal'>
                        <button id="hero-sign-in-trigger"></button>
                    </SignInButton>
                </div>

                {/* 5. HERO IMAGE */}
                <motion.div
                    variants={ctaVariants} // Reuse CTA variants for timing
                    initial="hidden"
                    animate={animateState} // ⭐️ CONTROLLED ANIMATION
                    className='relative'>
                    {/* Ensure your image assets (hero_img and bgImage1) are correctly configured in assets.js */}
                    <img src={assets.hero_img} className='w-full max-w-6xl' alt="NoteFlow Hero Image" />
                    <img src={assets.bgImage1} className='absolute -top-40 -right-40 sm:-top-100 sm:-right-70 -z-1 dark:hidden' alt="Background graphic" />
                </motion.div>

            </div >
        </div>
    )
}

export default Hero