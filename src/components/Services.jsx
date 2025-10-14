import React from 'react'
import assets from '../assets/assets'
import Title from './Title'
import ServiceCard, { itemVariants } from './ServiceCard'
// ⭐️ ANIMATION: Standardized import
import { motion } from "framer-motion"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1 // Stagger delay
        }
    }
};

const Services = () => {
    const serviceData = [
        {
            title: "Versatile Inputs",
            description: "Upload PDFs, paste text, or just enter a topic. Our AI handles any format",
            icon: assets.ads_icon,
            // ⭐️ SEO: Added descriptive alt text
            alt: "Icon representing multiple input formats like text and documents."
        },
        {
            title: "Instant Infographic Generation",
            description: "Let our AI instantly build structured, visual infographics from your notes.",
            icon: assets.marketing_icon,
            // ⭐️ SEO: Added descriptive alt text
            alt: "Icon of a graph and chart, symbolizing infographic generation."
        },
        {
            title: "Easy Sharing",
            description: "Get a unique link for any guide. Share it instantly with anyone, anywhere.",
            icon: assets.content_icon,
            // ⭐️ SEO: Added descriptive alt text
            alt: "Icon of a share symbol."
        },
        {
            title: "Listen & Learn",
            description: "Turn any study guide into an audiobook for learning on the go.",
            icon: assets.social_icon,
            // ⭐️ SEO: Added descriptive alt text
            alt: "Icon of headphones, representing audio playback."
        },
    ]

    return (
        // ⭐️ SEO: Changed from motion.div to motion.section
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
            id='services'
            className='relative flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-20 sm:pt-40 text-gray-700 dark:text-white bg-transparent'>

            <img src={assets.bgImage2} className='absolute -top-110 -left-70 -z-1 dark:hidden' alt="" />
            <Title title='How can we help?' desc='From note-taking to organizing and planning, NoteFlow makes it easier to manage your ideas and keep everything connected' />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                viewport={{ once: true }}
                className='flex flex-col md:grid grid-cols-2'>
                {serviceData.map((service, index) => (
                    <ServiceCard key={index} service={service} index={index} variants={itemVariants} />
                ))}
            </motion.div>
        </motion.section>
    )
}

export default Services