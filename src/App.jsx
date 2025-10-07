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
import { SignInButton } from '@clerk/clerk-react' 

const LandingPage = ({ theme, setTheme }) => (
  // This component groups the existing landing page sections
  <>
    <Hero />
    <Services />
    <Teams />
  </>
)

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')
  const location = useLocation() // ⭐️ Use useLocation hook
  const isGeneratorPage = location.pathname === '/generate' // ⭐️ Check if we are on the generator page

  const dotRef = useRef(null)
  const outlineRef = useRef(null)

  const mouse = useRef({ x: 0, y: 0 })
  const position = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // ... (existing mouse cursor logic) ...
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    document.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      position.current.x += (mouse.current.x - position.current.x) * 0.1
      position.current.y += (mouse.current.y - position.current.y) * 0.1

      if (dotRef.current && outlineRef.current) {
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
      {/* ⭐️ Pass isGeneratorPage to Navbar */}
      <Navbar theme={theme} setTheme={setTheme} isGeneratorPage={isGeneratorPage} /> 
      
      {/* ⭐️ Define Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<InfographicGenerator />} />
        {/* You can add more routes here, like '/dashboard' */}
      </Routes>
      
      {/* Footer only shows on the landing page */}
      {!isGeneratorPage && <Footer theme={theme} />} 


      <div ref={outlineRef} className='fixed top-0 left-0 h-10 w-10 rounded-full border border-primary pointer-events-none z-[9999]' style={{transition: 'transform 0.1s ease-out'}}></div>

      <div ref={dotRef} className='fixed top-0 left-0 h-3 w-3 rounded-full bg-primary pointer-events-none z-[9999]'></div>
    </div>
  )
}

export default App