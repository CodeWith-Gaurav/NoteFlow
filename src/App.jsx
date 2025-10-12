import React, { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Teams from './components/Teams'
import Footer from './components/Footer'
import { Routes, Route, useLocation } from 'react-router-dom'
import InfographicGenerator from './pages/InfographicGenerator'
import Preloader from './components/Preloader'
import FAQSection from './components/FAQSection'
import CTABanner from './components/CTABanner'
import { SignInButton } from '@clerk/clerk-react'


const LandingPage = ({ theme, setTheme, isEntranceAnimationComplete }) => (
    <>

        <title>NoteFlow | Transform Notes into Smart Infographics</title>
        <meta name="description" content="Turn scattered ideas into structured knowledge with NoteFlow. Our AI-powered tool instantly generates beautiful and informative infographics from your notes, PDFs, or text." />
        <Hero theme={theme} isEntranceAnimationComplete={isEntranceAnimationComplete} />
        <Services />
        <Teams />
        <FAQSection theme={theme} />
        <CTABanner theme={theme} />
    </>
)

const App = () => {
    const [loading, setLoading] = useState(true)
    const [isEntranceAnimationComplete, setEntranceAnimationComplete] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')
    const location = useLocation()
    const isGeneratorPage = location.pathname === '/generate'

    const mouse = useRef({ x: 0, y: 0 })

    const handleLoaderComplete = () => {
        setLoading(false);
        setTimeout(() => {
            setEntranceAnimationComplete(true);
        }, 50);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX
            mouse.current.y = e.clientY
        }
        document.addEventListener('mousemove', handleMouseMove)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])


    return (
        <div className='relative'>
            {loading && <Preloader onLoaderComplete={handleLoaderComplete} />}
            {theme === 'dark' && (
                <div 
                    className="fixed inset-0 z-[-1] min-h-screen w-full" 
                    style={{
                        // Using 'fixed' instead of 'absolute' and z-[-1] to ensure it covers the entire viewport and stays behind content
                        background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
                    }}
                />
            )}
            {theme === 'light' && (
                <div 
                    className="fixed inset-0 z-[-1] min-h-screen w-full bg-white" 
                    style={{
                        backgroundImage: `
                            radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
                        `,
                        backgroundSize: "100% 100%",
                    }}
                />
            )}
            <div className={loading ? 'invisible' : 'visible'}>
                <Navbar theme={theme} setTheme={setTheme} isGeneratorPage={isGeneratorPage} isEntranceAnimationComplete={isEntranceAnimationComplete} />

                {/* ⭐️ SEO: Use a <main> tag for primary content */}
                <main>
                    <Routes>
                        <Route path="/" element={<LandingPage theme={theme} setTheme={setTheme} isEntranceAnimationComplete={isEntranceAnimationComplete} />} />
                        <Route path="/generate" element={<InfographicGenerator />} />
                    </Routes>
                </main>

                {!isGeneratorPage && <Footer theme={theme} />}
            </div>
        </div>
    )
}

export default App