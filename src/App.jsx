import React, { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Teams from './components/Teams'
import Footer from './components/Footer'
// ⭐️ Import necessary components for routing
import { Routes, Route, useLocation } from 'react-router-dom'
// ⭐️ Import the new Generator page
import InfographicGenerator from './pages/InfographicGenerator'
import Preloader from './components/Preloader'
import FAQSection from './components/FAQSection'
import { SignInButton } from '@clerk/clerk-react' // Retaining existing import

const HAS_LOADED_KEY = 'hasLoadedBefore';

// ⭐️ FIX: Add theme/setTheme props to LandingPage definition
const LandingPage = ({ theme, setTheme, isEntranceAnimationComplete }) => (
    // This component groups the existing landing page sections
    <>

        <Hero theme={theme} isEntranceAnimationComplete={isEntranceAnimationComplete} />
        <Services />
        <Teams />

        <FAQSection theme={theme} />
    </>
)

const App = () => {
    // ⭐️ Initial state for Preloader (CORRECT)
    const [loading, setLoading] = useState(true)
    // ⭐️ NEW STATE: Controls when entrance animations start
    const [isEntranceAnimationComplete, setEntranceAnimationComplete] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')
    const location = useLocation()
    const isGeneratorPage = location.pathname === '/generate'

    // ⭐️ REMOVED: dotRef and outlineRef are no longer needed for the custom cursor.

    // ⭐️ RETAINED: mouse ref is still needed to track position for particle interaction.
    const mouse = useRef({ x: 0, y: 0 })
    // ⭐️ REMOVED: position ref is no longer needed (it was for custom cursor's smoothing)

    // ⭐️ CRITICAL LOADER CALLBACK (CORRECT)
    const handleLoaderComplete = () => {
        // This is called from Preloader.jsx's GSAP onComplete
        setLoading(false);


        setTimeout(() => {
            setEntranceAnimationComplete(true);
        }, 50);
    };

    useEffect(() => {
        // ⭐️ RETAINED: The handleMouseMove listener is crucial for particle interaction.
        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX
            mouse.current.y = e.clientY
        }

        document.addEventListener('mousemove', handleMouseMove)

        // ⭐️ REMOVED: The custom cursor 'animate' loop is no longer needed.
        // The position smoothing logic is also removed.

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])


    return (
        <div className='dark:bg-black relative'>
            {/* ⭐️ LOADER INTEGRATION: Only render Preloader if loading is true (CORRECT) */}
            {loading && <Preloader onLoaderComplete={handleLoaderComplete} />}


            {/* ⭐️ CONTENT WRAPPER: Opacity is 0 while loading, then instantly 100% (CORRECT) */}
            <div className={loading ? 'invisible' : 'visible'}>

                <Navbar theme={theme} setTheme={setTheme} isGeneratorPage={isGeneratorPage} isEntranceAnimationComplete={isEntranceAnimationComplete} />

                <Routes>
                    {/* ⭐️ PASS PROPS TO LANDING PAGE */}
                    <Route path="/" element={<LandingPage theme={theme} setTheme={setTheme} isEntranceAnimationComplete={isEntranceAnimationComplete} />} />
                    <Route path="/generate" element={<InfographicGenerator />} />
                </Routes>

                {/* Footer only shows on the landing page */}
                {!isGeneratorPage && <Footer theme={theme} />}
            </div>

            {/* ⭐️ REMOVED: Custom Cursor HTML elements are no longer rendered here. */}
        </div>
    )
}

export default App