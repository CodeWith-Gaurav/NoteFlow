import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import InfographicPage from "./pages/InfographicPage";
import About from "./pages/About";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />;
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case "infographic":
        return <InfographicPage setCurrentPage={setCurrentPage} />;
      case "about":
        return <About setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
