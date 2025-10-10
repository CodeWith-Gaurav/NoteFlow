import React from 'react'
import assets from '../assets/assets'
// ⭐️ ANIMATION: Standardized import
import { motion } from "framer-motion"
import { Link } from 'react-router-dom'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const Footer = ({ theme }) => {
    const { isSignedIn } = useUser()
    const navigate = useNavigate()

    const handleGetStarted = () => {
        if (!isSignedIn) {
            const signInButton = document.getElementById('footer-sign-in-trigger');
            if (signInButton) {
                signInButton.click();
            }
        } else {
            navigate('/generate');
        }
    }

    return (
        // ⭐️ SEO: Changed from motion.div to motion.footer
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            viewport={{ once: true }}
            className='bg-slate-50 dark:bg-gray-900 pt-10 sm:pt-10 mt-20 sm:mt-40 px-4 sm:px-10 lg:px-24 xl:px-40'>
            <div className='flex justify-between lg:items-center max-lg:flex-col gap-10'>
                <div className='space-y-5 text-sm text-gray-700 dark:text-gray-400'>
                    <img src={theme === 'dark' ? assets.logo_dark : assets.logo} className="w-32 sm:w-44" alt="NoteFlow Logo" />
                    <p className='max-w-md'>From strategy to execution, we craft digital solutions that move your business forward.</p>
                    <ul className='flex gap-8'>
                        <li className='hover:text-primary'><a href="#hero">Home</a></li>
                        <li className='hover:text-primary'><a href="#services">Services</a></li>
                        <li className='hover:text-primary'><a href="#teams">Our Team</a></li>
                        <li className='hover:text-primary'><a href="#hero">Vision</a></li>
                    </ul>
                </div>
                <div className='text-gray-600 dark:text-gray-400'>
                    <h3 className='font-semibold'>Generate Infographics</h3>
                    <p className='text-sm mt-2 mb-6'>Your smart companion for capturing, organizing, and learning better.</p>
                    <div className='flex gap-2 text-sm'>
                        <div
                            onClick={handleGetStarted}
                            className='text-sm max-sm:hidden flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full cursor-pointer hover:scale-103 transition-all'>
                            Get Started <img src={assets.arrow_icon} width={14} alt="" />
                        </div>
                    </div>
                    <div className='hidden'>
                        <SignInButton mode='modal'>
                            <button id="footer-sign-in-trigger"></button>
                        </SignInButton>
                    </div>
                </div>
            </div>
            <hr className='border-gray-300 dark:border-gray-600 my-6' />
            <div className='pb-6 text-sm text-gray-500 flex justify-center sm:justify-between gap-4 flex-wrap'>
                <p>Copyright 2025 @ NoteFlow - All Rights Reserved.</p>
                <div className='flex items-center justify-between gap-4'>
                    {/* ⭐️ SEO: Added descriptive alt text */}
                    <img src={assets.facebook_icon} alt="Facebook" />
                    <img src={assets.twitter_icon} alt="Twitter" />
                    <img src={assets.instagram_icon} alt="Instagram" />
                </div>
            </div>
        </motion.footer>
    )
}

export default Footer