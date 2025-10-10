import React, { useState } from 'react'
import assets from '../assets/assets'
import ThemeToggleBtn from './ThemeToggleBtn'
// ⭐️ ANIMATION: Standardized import
import { motion } from "framer-motion"
import { Link, useNavigate } from 'react-router-dom'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'

const Navbar = ({ theme, setTheme, isGeneratorPage, isEntranceAnimationComplete }) => {
    const navVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1, 
            transition: { 
                type: 'spring', 
                stiffness: 120, 
                delay: 0.2 
            } 
        },
    };
    
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { isSignedIn } = useUser()

    // Button logic remains the same...
    const buttonClass = 'text-sm max-sm:hidden flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full cursor-pointer hover:scale-103 transition-all'
    let AuthButton;
    if (isSignedIn) {
        AuthButton = (
            <div className={`max-sm:hidden ${isGeneratorPage ? 'hidden' : 'block'}`}>
                <UserButton afterSignOutUrl="/" />
            </div>
        )
    } else {
        AuthButton = (
            <SignInButton mode='modal'>
                <div className={buttonClass}>
                    Sign Up
                </div>
            </SignInButton>
        )
    }

    return (
        // ⭐️ SEO: Changed from motion.div to motion.nav for semantics
        <motion.nav
            variants={navVariants}
            initial="hidden"
            animate={isEntranceAnimationComplete ? "visible" : "hidden"} 
            className={`flex justify-between items-center 
                ${isGeneratorPage ? 'px-4 py-3' : 'px-4 sm:px-12 lg:px-24 xl:px-40 py-4'} 
                sticky top-0 z-20 backdrop-blur-xl font-medium 
                bg-white/50 dark:bg-gray-900/70`
            }>
            <Link to='/' className={`w-32 sm:w-40 ${isGeneratorPage ? 'max-w-[100px] sm:max-w-[120px]' : ''}`}>
                <img src={theme === 'dark' ? assets.logo_dark : assets.logo} className='w-full' alt='NoteFlow Logo' />
            </Link>
            
            {!isGeneratorPage && (
                <div className={`text-gray-700 dark:text-white sm:text-sm ${!sidebarOpen ? "max-sm:w-0 overflow-hidden" : "max-sm:w-60 max-sm:pl-10"} max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-primary max-sm:text-white max-sm:pt-20 flex sm:items-center gap-5 transform-all`}>
                    <img src={assets.close_icon} className='w-5 absolute right-4 top-4 sm:hidden' onClick={() => setSidebarOpen(false)} alt="Close menu" />
                    <Link to='/' onClick={() => setSidebarOpen(false)} className='sm:hover:border-b'>Home</Link>
                    <a onClick={() => setSidebarOpen(false)} href="/#services" className='sm:hover:border-b'>Services</a>
                    <a onClick={() => setSidebarOpen(false)} href="/#teams" className='sm:hover:border-b'>Our Team</a>
                    <a onClick={() => setSidebarOpen(false)} href="#" className='sm:hover:border-b cursor-not-allowed'>Dashboard</a>
                </div>
            )}

            <div className='flex items-center gap-2 sm:gap-4'>
                {!isGeneratorPage && <ThemeToggleBtn theme={theme} setTheme={setTheme} />}
                
                {/* ⭐️ ACCESSIBILITY: Changed from img to button */}
                {!isGeneratorPage && (
                    <button onClick={() => setSidebarOpen(true)} className='sm:hidden' aria-label="Open menu">
                        <img src={theme === 'dark' ? assets.menu_icon_dark : assets.menu_icon} alt="" className='w-8' />
                    </button>
                )}
                
                {AuthButton}
            </div>
            <div className='hidden cl-sign-in-button'>
                <SignInButton mode='modal' />
            </div>
        </motion.nav>
    )
}

export default Navbar