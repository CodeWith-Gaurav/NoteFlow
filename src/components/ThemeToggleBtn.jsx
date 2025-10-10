import React, { useEffect } from 'react'
import assets from '../assets/assets'

const ThemeToggleBtn = ({theme, setTheme}) => {
    useEffect(()=> {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(theme || (prefersDarkMode ? 'dark' : 'light'))
    }, [])
    
    useEffect(()=>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark')
        }else{
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    },[theme])

    return (
        // ⭐️ ACCESSIBILITY: Added aria-label
        <button aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? (
                <img onClick={()=> setTheme('light')} src={assets.sun_icon} className='size-8.5 p-1.5 border border-gray-500 rounded-full' alt="Light mode icon" />
            ) : (
                <img onClick={()=> setTheme('dark')} src={assets.moon_icon} className='size-8.5 p-1.5 border border-gray-500 rounded-full' alt="Dark mode icon" />
            )}
        </button>
    )
}

export default ThemeToggleBtn