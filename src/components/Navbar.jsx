import React, { useState } from 'react'
import assets from '../assets/assets'
import ThemeToggleBtn from './ThemeToggleBtn'
import { motion } from "motion/react"
// 1. Import Clerk hooks and components
import { useUser, useClerk, SignInButton } from '@clerk/clerk-react'


const Navbar = ({ theme, setTheme }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    // 2. Use the hooks
    const { isSignedIn } = useUser()
    const { signOut } = useClerk()

    // Tailwind Class for the button to maintain styling
    const buttonClass = 'text-sm max-sm:hidden flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full cursor-pointer hover:scale-103 transition-all'
    
    // 3. Conditional Button Logic
    let AuthButton;
    
    if (isSignedIn) {
        // Option A: User is signed in -> Show "Sign Out"
        AuthButton = (
            <a 
                onClick={() => signOut()} // Call Clerk's signOut function on click
                className={buttonClass}>
                Log Out
            </a>
        )
    } else {
        // Option B: User is signed out -> Show "Sign Up" (which handles Sign In)
        AuthButton = (
            // <SignInButton> triggers Clerk's modal, which is smart enough
            // to offer Sign Up for new users and Sign In for existing users.
            // We set 'mode="modal"' for a clean overlay.
            <SignInButton mode='modal'>
                {/* The content wrapped by <SignInButton> gets the click handler */}
                <div className={buttonClass}>
                    Sign Up
                </div>
            </SignInButton>
        )
    }

    // Note on Google Account Notification:
    // Clerk's modal natively handles displaying past sign-in methods (like Google)
    // and prompting the user to continue with them. This happens automatically 
    // inside the modal when an existing user clicks the button.

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-20 backdrop-blur-xl font-medium bg-white/50 dark:bg-gray-900/70'>

            <img src={theme === 'dark' ? assets.logo_dark : assets.logo} className='w-32 sm:w-40' alt='' />
            
            <div className={`text-gray-700 dark:text-white sm:text-sm ${!sidebarOpen ? "max-sm:w-0 overflow-hidden" : "max-sm:w-60 max-sm:pl-10"} max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-primary max-sm:text-white max-sm:pt-20 flex sm:items-center gap-5 transform-all`}>
                <img src={assets.close_icon} className='w-5 absolute right-4 top-4 sm:hidden' onClick={() => setSidebarOpen(false)} alt="" />
                <a onClick={() => setSidebarOpen(false)} href="#" className='sm:hover:border-b'>Home</a>
                <a onClick={() => setSidebarOpen(false)} href="#services" className='sm:hover:border-b'>Services</a>
                <a onClick={() => setSidebarOpen(false)} href="#teams" className='sm:hover:border-b'>Our Team</a>
            </div>

            <div className='flex items-center gap-2 sm:gap-4'>
                <ThemeToggleBtn theme={theme} setTheme={setTheme} />
                <img src={theme === 'dark' ? assets.menu_icon_dark : assets.menu_icon} alt="" onClick={() => setSidebarOpen(true)} className='w-8 sm:hidden' />
                
                {/* 4. Render the conditional AuthButton */}
                {AuthButton}
            </div>
        </motion.div>
    )
}

export default Navbar