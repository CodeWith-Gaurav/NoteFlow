import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import assets from '../assets/assets'
import { useUser, UserButton } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const InfographicGenerator = () => {
    const [input, setInput] = useState('')
    const [uploadedFile, setUploadedFile] = useState(null)
    // ⭐️ Start hidden on mobile, open on desktop
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768)
    const { isSignedIn, isLoaded } = useUser()

    const mockHistory = [
        "Infographic: Machine Learning",
        "Summary of Quantum Physics PDF",
        "Infographic on NoteFlow features",
        "Key dates of World War II",
    ]

    const FULL_SIDEBAR_WIDTH = '280px'
    const MINI_SIDEBAR_WIDTH = '64px' // Tailwind w-16

    // Effect to handle mobile/desktop default state on initial load
    useEffect(() => {
        const handleResize = () => {
            // Force full sidebar closed on mobile (but show the mini-sidebar)
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false)
            }
            // Note: We intentionally don't force it open on desktop resize 
            // to respect the user's preference after the initial load.
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (isLoaded && !isSignedIn) {
        return <Navigate to="/" replace />
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setUploadedFile(file)
        }
    }

    const handleNewChat = () => {
        setInput('');
        setUploadedFile(null);
        // Add logic to clear the actual chat state here
    }

    return (
        // ⭐️ Main container: use the same background as the landing page body/home page to blend the navbar
        <div className='min-h-screen flex text-gray-800 dark:text-white dark:bg-black relative'>

            {/* ⭐️ SIDEBAR CONTAINER (Fixed on Mobile, Relative on Desktop) ⭐️ */}
            <div
                // The sidebar should always be present on desktop (md:block)
                // On mobile, it's fixed (full height) and slides in/out.
                className={`flex-shrink-0 bg-white dark:bg-[#202123] border-r border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out fixed top-0 left-0 md:relative z-30
                    ${isSidebarOpen ? 'w-[280px]' : 'w-[280px] md:w-[64px]'} 
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[-280px] md:translate-x-0'}
                    md:translate-x-0
                `}
            // The main width logic is controlled by the class above for transitions
            >
                {/* ⭐️ Full/Open Sidebar View ⭐️ */}
                {isSidebarOpen ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className='h-full flex flex-col p-4 pt-16 md:pt-4 overflow-hidden'
                    >
                        {/* Top Menu: Toggle + New Chat */}
                        <div className='flex items-center justify-between pb-4 md:pb-0'>
                            {/* Toggle Button */}
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                                title="Collapse Sidebar"
                            >
                                <img src={assets.menu_icon} className='w-6 dark:invert' alt="Toggle Sidebar" />
                            </button>

                            {/* New Chat Button */}
                            <button
                                onClick={handleNewChat}
                                className='flex items-center gap-2 p-2 px-3 text-sm font-semibold bg-primary text-white rounded-full hover:opacity-90 transition-opacity'
                            >
                                <img src={assets.arrow_icon} className='w-4 rotate-45 invert' alt="New chat" />
                                New chat
                            </button>
                        </div>

                        {/* History List */}
                        <div className='flex-1 overflow-y-auto space-y-2 py-4 scrollbar-hide'>
                            <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 ml-2'>Recent</p>
                            {mockHistory.map((item, index) => (
                                <div key={index} className='p-2 text-sm truncate hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors'>
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* Sidebar Footer with UserButton */}
                        <div className='pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between'>
                            <p className='text-xs text-gray-500 dark:text-gray-600'>NoteFlow v1.0</p>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </motion.div>
                ) : (
                    // ⭐️ Mini/Closed Sidebar View (Permanent on Desktop, Hidden on Mobile) ⭐️
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='h-full flex-col items-center p-2 pt-16 md:pt-4 overflow-hidden hidden md:flex' // Hidden on mobile, shown on desktop
                    >
                        {/* Toggle Button (to open the full sidebar) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4'
                            title="Expand Sidebar"
                        >
                            <img src={assets.menu_icon} className='w-6 dark:invert' alt="Toggle Sidebar" />
                        </button>

                        {/* New Chat Icon */}
                        <button
                            onClick={handleNewChat}
                            className='p-3 rounded-full bg-primary hover:opacity-90 transition-opacity flex items-center justify-center'
                            title="New chat"
                        >
                            <img src={assets.arrow_icon} className='w-5 rotate-45 invert' alt="New chat" />
                        </button>
                    </motion.div>
                )}

                {/* ⭐️ Mobile Overlay (to dismiss the sidebar) ⭐️ */}
                <AnimatePresence>
                    {isSidebarOpen && window.innerWidth < 768 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className='fixed inset-0 bg-black/50 z-20 md:hidden'
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* ⭐️ MAIN GENERATOR AREA ⭐️ */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                // The flex-1 takes the remaining space, achieving the shifting effect automatically
                className='flex-1 flex flex-col h-screen overflow-y-auto pt-16 md:pt-0 relative'
            >

                {/* ⭐️ Mobile Sidebar Open Button (When Sidebar is hidden on mobile) ⭐️ */}
                {!isSidebarOpen && window.innerWidth < 768 && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className='absolute top-4 left-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 z-20 md:hidden'
                    >
                        <img src={assets.menu_icon} className='w-6 dark:invert' alt="Open Sidebar" />
                    </button>
                )}


                <div className='flex-1 flex flex-col items-center justify-start w-full max-w-4xl mx-auto py-8 px-4 sm:px-0'>

                    {/* Generator Header/Title */}
                    <h1 className='text-3xl sm:text-4xl font-bold mb-8 text-center'>
                        Infographic <span className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent'>Studio</span>
                    </h1>

                    {/* Main Content Area */}
                    <div className='flex-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 overflow-y-auto shadow-2xl'>

                        {/* Placeholder for Infographics/Results */}
                        <div className='flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-600 p-4'>
                            <img src={assets.logo_dark} className='w-16 h-16 opacity-10 mb-4' alt="Logo" />
                            <p className='text-lg'>Start by typing a prompt or uploading a document below.</p>
                            <p className='text-sm mt-1'>NoteFlow will transform your data into a structured infographic.</p>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className='w-full max-w-3xl relative'>
                        <div className='flex items-center p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl dark:shadow-gray-900/50'>

                            {/* File Upload Button/Icon */}
                            <label htmlFor="file-upload" className='cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                                <img src={uploadedFile ? assets.content_icon : assets.ads_icon} className='w-6 opacity-60 dark:invert' alt="Upload" />
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf, .txt"
                                    onChange={handleFileChange}
                                    className='hidden'
                                />
                            </label>

                            {/* Prompt Textarea */}
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows={1}
                                placeholder={uploadedFile ? `Document uploaded: ${uploadedFile.name}. Add your prompt...` : "Enter a topic or paste text here to generate an infographic..."}
                                className='flex-1 resize-none bg-transparent outline-none border-none placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base px-3 py-1.5 scrollbar-hide'
                                style={{ maxHeight: '200px' }}
                                disabled={!isSignedIn}
                            />

                            {/* Send Button */}
                            <button
                                disabled={!input && !uploadedFile}
                                className={`p-2 sm:p-3 rounded-full transition-all ${(input || uploadedFile) ? 'bg-primary hover:scale-105' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70'
                                    }`}
                            >
                                <img src={assets.arrow_icon} className='w-5 rotate-45 dark:invert' alt="Send" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default InfographicGenerator