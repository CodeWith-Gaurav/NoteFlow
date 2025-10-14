// App.jsx (MODIFIED)

import React, { useState, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import Preloader from './components/Preloader';

// 1. LAZY LOAD HEAVY COMPONENTS
const LazyServices = React.lazy(() => import('./components/Services'));
const LazyFAQSection = React.lazy(() => import('./components/FAQSection'));
const LazyCTABanner = React.lazy(() => import('./components/CTABanner'));
const LazyInfographicGenerator = React.lazy(() => import('./pages/InfographicGenerator'));


const LandingPage = ({ theme, setTheme, isEntranceAnimationComplete, isLoadedAndVisible }) => (
    // 2. Only render heavy components when fully loaded and visible
    <>
        <title>NoteFlow | Transform Notes into Smart Infographics</title>
        <meta name="description" content="Turn scattered ideas into structured knowledge with NoteFlow. Our AI-powered tool instantly generates beautiful and informative infographics from your notes, PDFs, or text." />

        {/* HERO REMAINS FOR INITIAL LOAD (if it's not too heavy, but OGL component needs a fix) */}
        <Hero theme={theme} isEntranceAnimationComplete={isEntranceAnimationComplete} isLoadedAndVisible={isLoadedAndVisible} />

        {isLoadedAndVisible && (
            <Suspense fallback={null}> {/* Fallback=null since content is hidden anyway */}
                <LazyServices />
                <LazyFAQSection theme={theme} />
                <LazyCTABanner theme={theme} />
            </Suspense>
        )}
    </>
);

const App = () => {
    const [loading, setLoading] = useState(true)
    const [isEntranceAnimationComplete, setEntranceAnimationComplete] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')
    const location = useLocation()
    const isGeneratorPage = location.pathname === '/generate'

    const isLoadedAndVisible = !loading && isEntranceAnimationComplete;

    const handleLoaderComplete = () => {
        setLoading(false);
        setTimeout(() => {
            setEntranceAnimationComplete(true);
        }, 50);
    };


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
            {(!loading) && (
                <div className={!isLoadedAndVisible ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
                    <Navbar
                        theme={theme}
                        setTheme={setTheme}
                        isGeneratorPage={isGeneratorPage}
                        isEntranceAnimationComplete={isEntranceAnimationComplete}
                    />

                    <main>
                        <Routes>
                            <Route
                                path="/"
                                element={<LandingPage
                                    theme={theme}
                                    setTheme={setTheme}
                                    isEntranceAnimationComplete={isEntranceAnimationComplete}
                                    isLoadedAndVisible={isLoadedAndVisible}
                                />}
                            />
                            <Route
                                path="/generate"
                                element={
                                    <Suspense fallback={<div>Loading Generator...</div>}>
                                        <LazyInfographicGenerator />
                                    </Suspense>
                                }
                            />
                        </Routes>
                    </main>

                    {!isGeneratorPage && <Footer theme={theme} />}
                </div>
            )}
        </div>
    );
}

export default App