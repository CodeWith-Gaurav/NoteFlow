// src/components/FAQSection.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// ⭐️ CORRECTED IMPORT PATH: Assuming the file is named 'faqData.js' and is two levels up.
import { faqContent } from './../assets/assets'; 

// ⭐️ UPDATED: FAQ Item now accepts isOpen and onClick handler
const FAQItem = ({ question, answer, isOpen, onClick }) => {
    // Dynamic background classes for light/dark mode
    const itemClasses = 'border-b last:border-b-0 cursor-pointer p-5 transition-colors duration-300 ' + 
                        'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-gray-100 ' + 
                        'hover:bg-gray-100 dark:hover:bg-[#2c2c2c] border-gray-200 dark:border-gray-800';
    
    // Icon variants for rotation
    const iconVariants = {
        open: { rotate: 180 },
        closed: { rotate: 0 }
    };

    // Answer content variants for slide/fade animation
    const contentVariants = {
        open: { opacity: 1, height: "auto", paddingBottom: "1.25rem" },
        closed: { opacity: 0, height: 0, paddingBottom: 0 }
    };

    // ⭐️ IMPORTANT: The onClick prop is now used to control the state in the parent
    return (
        <motion.div className={itemClasses} onClick={onClick}>
            {/* Question Bar */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium max-sm:text-base">{question}</h3>
                <motion.div
                    variants={iconVariants}
                    animate={isOpen ? "open" : "closed"} // ⭐️ Controlled by parent's state
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                >
                    {/* Simple chevron icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </motion.div>
            </div>
            
            {/* Answer Content */}
            <AnimatePresence initial={false}>
                {isOpen && ( // ⭐️ Controlled by parent's state
                    <motion.div
                        key="content"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={contentVariants}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        {/* Text is darker in light mode, lighter in dark mode */}
                        <p className="pt-4 text-gray-600 dark:text-gray-400 text-base max-sm:text-sm">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


// Main FAQ Section Component
const FAQSection = ({ theme }) => {
    // ⭐️ NEW STATE: Store the index of the currently open question. -1 means none are open.
    const [activeIndex, setActiveIndex] = useState(-1);

    // ⭐️ NEW HANDLER: Toggles the state, ensuring that clicking the active item closes it.
    const handleItemClick = (index) => {
        setActiveIndex(activeIndex === index ? -1 : index);
    };

    // ⭐️ Define entrance animation variants for the section (no change)
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.7, 
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.1 
            } 
        }
    };

    // Determine the theme classes for the entire section (no change)
    const sectionBg = theme === 'dark' 
        ? 'bg-black text-white' 
        : 'bg-gray-50 text-gray-900';
    
    const titleColor = theme === 'dark' 
        ? 'text-white' 
        : 'text-gray-900';

    return (
        <motion.section 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className={`py-20 max-sm:py-12 ${sectionBg}`}
        >
            <div className="container mx-auto px-4 sm:px-12 lg:px-24 xl:px-40">
                
                {/* Header Content (no change) */}
                <motion.div 
                    variants={sectionVariants}
                    className="text-center mb-12"
                >
                    <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-400">
                        FAQs
                    </span>
                    <h2 className={`mt-4 text-4xl sm:text-5xl font-medium ${titleColor}`}>
                        We’ve Got the Answers You’re Looking For
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                        Quick answers to your AI automation and infographic generation questions.
                    </p>
                </motion.div>

                {/* FAQ List Container */}
                <motion.div 
                    variants={sectionVariants}
                    className="max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden"
                >
                    {faqContent.map((item, index) => (
                        <FAQItem 
                            key={index} 
                            question={item.q} 
                            answer={item.a}
                            // ⭐️ Pass down the state and handler
                            isOpen={activeIndex === index} 
                            onClick={() => handleItemClick(index)}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default FAQSection;