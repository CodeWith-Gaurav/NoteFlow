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
import { SignInButton } from '@clerk/clerk-react' // Retaining existing import

const HAS_LOADED_KEY = 'hasLoadedBefore'; 

// ⭐️ FIX: Add theme/setTheme props to LandingPage definition
const LandingPage = ({ theme, setTheme, isEntranceAnimationComplete }) => (
  // This component groups the existing landing page sections
  <>
  
    <Hero isEntranceAnimationComplete={isEntranceAnimationComplete} />
    <Services />
    <Teams />
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

  const dotRef = useRef(null)
  const outlineRef = useRef(null)

  const mouse = useRef({ x: 0, y: 0 })
  const position = useRef({ x: 0, y: 0 })

  // ⭐️ CRITICAL LOADER CALLBACK (CORRECT)
  const handleLoaderComplete = () => {
    // This is called from Preloader.jsx's GSAP onComplete
    setLoading(false);


    setTimeout(() => {
      setEntranceAnimationComplete(true);
    }, 50);
  };

  useEffect(() => {
    // ... (existing mouse cursor logic - REMAINS UNCHANGED) ...
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    document.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      position.current.x += (mouse.current.x - position.current.x) * 0.1
      position.current.y += (mouse.current.y - position.current.y) * 0.1

      if (dotRef.current && outlineRef.current) {
        // Updated cursor animation to use current mouse positions
        dotRef.current.style.transform = `translate3d(${mouse.current.x - 6}px, ${mouse.current.y - 6}px, 0)`
        outlineRef.current.style.transform = `translate3d(${mouse.current.x - 20}px, ${mouse.current.y - 20}px, 0)`
      }

      requestAnimationFrame(animate)
    }

    animate()

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

        <Navbar theme={theme} setTheme={setTheme} isGeneratorPage={isGeneratorPage} isEntranceAnimationComplete={isEntranceAnimationComplete}/>

        <Routes>
          {/* ⭐️ PASS PROPS TO LANDING PAGE */}
          <Route path="/" element={<LandingPage theme={theme} setTheme={setTheme} isEntranceAnimationComplete={isEntranceAnimationComplete} />} />
          <Route path="/generate" element={<InfographicGenerator />} />
        </Routes>

        {/* Footer only shows on the landing page */}
        {!isGeneratorPage && <Footer theme={theme} />}
      </div>

      {/* Cursor elements are outside the wrapper so they aren't affected by the opacity transition (CORRECT) */}
      <div ref={outlineRef} className='fixed top-0 left-0 h-10 w-10 rounded-full border border-primary pointer-events-none z-[9999]' style={{ transition: 'transform 0.1s ease-out' }}></div>

      <div ref={dotRef} className='fixed top-0 left-0 h-3 w-3 rounded-full bg-primary pointer-events-none z-[9999]'></div>
    </div>
  )
}

export default App