'use client'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 active:scale-95 transition-all duration-300 group animate-fade-in-scale"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    
                    {/* Pulse animation */}
                    <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
                </button>
            )}
        </>
    )
}

export default ScrollToTop

