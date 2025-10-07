import React from 'react'
import assets from '../assets/assets'
import { motion } from "motion/react"
import { Link } from 'react-router-dom'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

// ⭐️ ACCEPT THE NEW PROP
const Hero = ({ isEntranceAnimationComplete }) => {
    const { isSignedIn } = useUser()
    const navigate = useNavigate()

    // ⭐️ Define a single transition object for reuse
    const transition = { duration: 0.6, ease: 'easeOut', type: 'tween' }
    
    // ⭐️ Define Variants for the Trust Badge
    const badgeVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { ...transition, delay: 0.3 } }
    }

    // ⭐️ Define Variants for the Main Heading
    const headingVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { ...transition, delay: 0.5 } }
    }

    // ⭐️ Define Variants for the Subheading/Paragraph
    const paragraphVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { ...transition, delay: 0.7 } }
    }

    // ⭐️ Define Variants for the CTA Button and Hero Image
    const ctaVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { ...transition, delay: 0.9 } }
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

    return (
        <div id='hero' className='flex flex-col items-center gap-6 py-20 px-4 sm:px-12 lg:px-24 xl:px-40 text-center w-full overflow-hidden text-gray-700 dark:text-white'>

            {/* 1. TRUST BADGE */}
            <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={animateState} // ⭐️ CONTROLLED ANIMATION
                viewport={{ once: true }}
                className='inline-flex items-center gap-2 border border-gray-300 p-1.5 pr-4 rounded-full'>
                <img className='w-20' src={assets.group_profile} alt="" />
                <p className='text-xs font-medium'>Trusted by Learners & Innovators</p>
            </motion.div>
            
            {/* 2. MAIN HEADING */}
            <motion.h1
                variants={headingVariants}
                initial="hidden"
                animate={animateState} // ⭐️ CONTROLLED ANIMATION
                viewport={{ once: true }}
                className='text-4xl sm:text-5xl md:text-6xl xl:text-[84px] font-medium xl:leading-[95px] max-w-5xl'>Transform Notes into Smart <span className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent'>Infographics</span>.</motion.h1>

            {/* 3. SUBHEADING/PARAGRAPH */}
            <motion.p
                variants={paragraphVariants}
                initial="hidden"
                animate={animateState} // ⭐️ CONTROLLED ANIMATION
                viewport={{ once: true }}
                className='text-sm sm:text-lg font-medium text-gray-500 dark:text-white/75 max-w-4/5 sm:max-w-lg pb-3'>Turn scattered ideas into structured knowledge.NoteFlow brings clarity to your thinking.</motion.p>

            {/* 4. CTA BUTTON */}
            <motion.div
                variants={ctaVariants}
                initial="hidden"
                animate={animateState} // ⭐️ CONTROLLED ANIMATION
                viewport={{ once: true }}>
                
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
                viewport={{ once: true }}
                className='relative'>
                <img src={assets.hero_img} className='w-full max-w-6xl' alt="" />
                <img src={assets.bgImage1} className='absolute -top-40 -right-40 sm:-top-100 sm:-right-70 -z-1 dark:hidden' alt="" />
            </motion.div>

        </div >
    )
}

export default Hero