// This is your entry point file, likely named index.tsx or main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' // Make sure the path to your App component is correct
import { ClerkProvider } from '@clerk/clerk-react'
// Import BrowserRouter for routing
import { BrowserRouter } from 'react-router-dom'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        {/* Your existing App component is now wrapped by ClerkProvider */}
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)