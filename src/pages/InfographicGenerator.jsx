import React, { useState, useEffect } from 'react'
// ⭐️ ANIMATION: Standardized import
import { motion, AnimatePresence } from "framer-motion"
import assets from '../assets/assets'
import { useUser, UserButton } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const InfographicGenerator = ({ theme }) => {
    // -----------------------------------------------------------------
    // 👇 FIX: Add the missing state declaration here
    // -----------------------------------------------------------------
    const [input, setInput] = useState('')
    const [uploadedFile, setUploadedFile] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768)
    const [isInputMenuOpen, setIsInputMenuOpen] = useState(false); // 👈 THIS WAS THE MISSING LINE!
    const { isSignedIn, isLoaded } = useUser()
    // -----------------------------------------------------------------

    const mockHistory = [
        "Infographic: Machine Learning",
        "Summary of Quantum Physics PDF",
        "Infographic on NoteFlow features",
        "Key dates of World War II",
    ]

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false)
            }
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
            setIsInputMenuOpen(false); // Close menu after selection
        }
    }

    const handleNewChat = () => {
        setInput('');
        setUploadedFile(null);
        setIsInputMenuOpen(false); // Close menu on new chat
    }

    const handleRatioSelection = (ratio) => {
        // You'll integrate this with your infographic generation logic later
        console.log(`Infographic ratio selected: ${ratio}`);
        alert(`Infographic ratio set to ${ratio}. This is a placeholder action.`);
        setIsInputMenuOpen(false); // Close menu after selection
    }

    // 🆕 New Handler for the Audiobook Button
    const handleAudiobookCreation = () => {
        // You'll integrate this with your audiobook logic later
        console.log("Audiobook creation initiated");
        alert('Audiobook creation initiated. This is a placeholder action.');
        setIsInputMenuOpen(false); // Close menu after selection
    }

    // 🆕 Helper function to close menu when clicking outside
    useEffect(() => {
        const closeMenu = (e) => {
            // Check if the click is outside the menu and the menu toggle buttons
            const isMenuArea = e.target.closest('.input-menu-area');
            if (isInputMenuOpen && !isMenuArea) {
                setIsInputMenuOpen(false);
            }
        };

        if (isInputMenuOpen) {
            document.addEventListener('mousedown', closeMenu);
        }
        return () => document.removeEventListener('mousedown', closeMenu);
    }, [isInputMenuOpen]);


    // ----------------------------------------------------------------------
    // 🆕 Menu Content JSX - Reusable component for both desktop and mobile
    // ----------------------------------------------------------------------
    const MenuOptions = ({ isMobile }) => (
        <>
            {/* 1. Upload File Option (Original functionality) */}
            <label
                htmlFor="file-upload"
                className={`flex items-center gap-3 p-3 text-sm rounded-lg cursor-pointer transition-colors ${isMobile ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <img src={assets.content_icon} className='w-5 opacity-80 dark:invert' alt="Upload document" />
                Upload Document (.pdf, .txt)
                <input
                    id="file-upload"
                    type="file"
                    accept=".pdf, .txt"
                    onChange={handleFileChange}
                    className='hidden'
                    onClick={(event) => { event.target.value = null }} // Allows re-uploading the same file
                />
            </label>

            {/* 2. Aspect Ratio Option */}
            <div className={`flex items-center gap-3 p-3 text-sm rounded-lg transition-colors ${isMobile ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}>
                <img src={assets.gallery_icon} className='w-5 opacity-80 dark:invert' alt="Select Ratio" />
                <span className='mr-2'>Infographic Ratio:</span>
                <button
                    onClick={() => handleRatioSelection('16:9')}
                    className='px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-primary-light transition-colors'
                >
                    16:9
                </button>
                <button
                    onClick={() => handleRatioSelection('9:16')}
                    className='px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-primary-light transition-colors'
                >
                    9:16
                </button>
            </div>

            {/* 3. Create Audiobook Option */}
            <button
                onClick={handleAudiobookCreation}
                className={`flex items-center gap-3 w-full p-3 text-sm rounded-lg transition-colors ${isMobile ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <img src={assets.mic_icon} className='w-5 opacity-80 dark:invert' alt="Create Audiobook" />
                Create Audiobook
            </button>
        </>
    );

    return (
        <div className='min-h-screen flex text-gray-800 dark:text-white bg-transparent relative'>

            <title>Infographic Studio | NoteFlow</title>
            <meta name="description" content="Create, edit, and generate stunning infographics from your documents and ideas in the NoteFlow Studio." />

            {theme === 'dark' && (
                <div
                    className="fixed inset-0 z-[-2] min-h-screen w-full"
                    style={{
                        background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
                    }}
                />
            )}

            {/* LIGHT MODE Background: Teal Glow Background */}
            {theme === 'light' && (
                <div
                    className="fixed inset-0 z-[-2] min-h-screen w-full bg-white"
                    style={{
                        backgroundImage: `
                            radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
                        `,
                        backgroundSize: "100% 100%",
                    }}
                />
            )}
            {/* Sidebar Container */}
            <div
                className={`flex-shrink-0 bg-white/90 dark:bg-[#202123]/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out fixed top-0 left-0 md:relative z-30
                    ${isSidebarOpen ? 'w-[280px]' : 'w-[280px] md:w-[64px]'} 
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[-280px] md:translate-x-0'}
                    md:translate-x-0
                  `}
            >
                {/* Sidebar content... */}
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
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                                title="Collapse Sidebar"
                            >
                                <img src={assets.menu_icon} className='w-6 dark:invert' alt="Toggle Sidebar" />
                            </button>
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
                        {/* Sidebar Footer */}
                        <div className='pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between'>
                            <p className='text-xs text-gray-500 dark:text-gray-600'>NoteFlow v1.0</p>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='h-full flex-col items-center p-2 pt-16 md:pt-4 overflow-hidden hidden md:flex'
                    >
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4'
                            title="Expand Sidebar"
                        >
                            <img src={assets.menu_icon} className='w-6 dark:invert' alt="Toggle Sidebar" />
                        </button>
                        <button
                            onClick={handleNewChat}
                            className='p-3 rounded-full bg-primary hover:opacity-90 transition-opacity flex items-center justify-center'
                            title="New chat"
                        >
                            <img src={assets.arrow_icon} className='w-5 rotate-45 invert' alt="New chat" />
                        </button>
                    </motion.div>
                )}
                <AnimatePresence>
                    {isSidebarOpen && window.innerWidth < 768 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className='fixed inset-0 bg-black/50 z-20 md:hidden'
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Main Generator Area */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='flex-1 flex flex-col h-screen overflow-y-auto pt-16 md:pt-0 relative bg-transparent'
            >
                {!isSidebarOpen && window.innerWidth < 768 && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className='absolute top-4 left-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 z-20 md:hidden'
                    >
                        <img src={assets.menu_icon} className='w-6 dark:invert' alt="Open Sidebar" />
                    </button>
                )}
                <div className='flex-1 flex flex-col items-center justify-start w-full max-w-4xl mx-auto py-8 px-4 sm:px-0'>
                    <h1 className='text-3xl sm:text-4xl font-bold mb-8 text-center'>
                        NoteFlow <span className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent'>Studio</span>
                    </h1>
                    {/* Main Content Area */}
                    <div className='flex-1 w-full bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 overflow-y-auto shadow-2xl'>
                        <div className='flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-600 p-4'>
                            <img src={assets.logo_dark} className='w-16 h-16 opacity-10 mb-4' alt="NoteFlow Logo" />
                            <p className='text-lg'>Start by typing a prompt or uploading a document below.</p>
                            <p className='text-sm mt-1'>NoteFlow will transform your data into a structured infographic.</p>
                        </div>
                    </div>
                    {/* Input Area */}
                    <div className='w-full max-w-3xl relative input-menu-area'>

                        {/* 🆕 Floating Menu (Desktop/Mobile) */}
                        <AnimatePresence>
                            {isInputMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.15 }}
                                    className={`absolute bottom-full mb-3 w-full sm:w-[350px] p-2 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700
                                        ${window.innerWidth >= 768 ? 'left-0' : 'left-1/2 transform -translate-x-1/2'} z-40
                                    `}
                                >
                                    <MenuOptions isMobile={window.innerWidth < 768} />
                                </motion.div>
                            )}
                        </AnimatePresence>


                        <div className='flex items-center p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl dark:shadow-gray-900/50'>

                            {/* 🆕 Unified Menu Toggle Button (Mobile: always visible, Desktop: hides the old upload icon) */}
                            <button
                                onClick={() => setIsInputMenuOpen(prev => !prev)}
                                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors input-menu-area'
                                title="Add Content/Options"
                            >
                                <img
                                    src={assets.add_icon}
                                    className={`w-6 opacity-60 dark:invert transition-transform duration-200 ${isInputMenuOpen ? 'rotate-45' : 'rotate-0'}`}
                                    alt="Add Options"
                                />
                            </button>

                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows={1}
                                placeholder={uploadedFile ? `Document uploaded: ${uploadedFile.name}. Add your prompt...` : "Enter a topic or paste text here to generate an infographic..."}
                                className='flex-1 resize-none bg-transparent outline-none border-none placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base px-3 py-1.5 scrollbar-hide'
                                style={{ maxHeight: '200px' }}
                                disabled={!isSignedIn}
                            />
                            <button
                                disabled={!input && !uploadedFile}
                                className={`p-2 sm:p-3 rounded-full transition-all ${(input || uploadedFile) ? 'bg-primary hover:scale-105' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70'}`}
                                title="Generate Infographic"
                            >
                                <img src={assets.arrow_icon} className='w-5 rotate-45 invert' alt="Send prompt" />
                            </button>
                        </div>

                        {/* 🆕 Upload File Tag (Display only when a file is uploaded) */}
                        <AnimatePresence>
                            {uploadedFile && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className='absolute bottom-[calc(100%+4px)] left-4 flex items-center bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full shadow-md'
                                >
                                    <span className="truncate max-w-[150px] sm:max-w-none mr-2">
                                        {uploadedFile.name}
                                    </span>
                                    <button
                                        onClick={() => setUploadedFile(null)}
                                        className='ml-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200'
                                        title='Remove file'
                                    >
                                        &times;
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default InfographicGenerator