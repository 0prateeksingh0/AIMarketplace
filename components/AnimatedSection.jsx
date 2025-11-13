'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Animated Section Component with Intersection Observer
 * Triggers animation when element enters viewport
 * 
 * @param {string} animation - Animation type: 'fade-up', 'fade-in', 'slide-left', 'slide-right', 'scale'
 * @param {number} delay - Animation delay in milliseconds
 * @param {number} threshold - Intersection observer threshold (0-1)
 */
const AnimatedSection = ({ 
    children, 
    animation = 'fade-up', 
    delay = 0, 
    threshold = 0.1,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true)
                    }, delay)
                }
            },
            {
                threshold,
                rootMargin: '0px'
            }
        )

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [delay, threshold])

    const animationClasses = {
        'fade-up': isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10',
        'fade-in': isVisible ? 'animate-fade-in-scale' : 'opacity-0',
        'slide-left': isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10',
        'slide-right': isVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-10',
        'scale': isVisible ? 'animate-fade-in-scale' : 'opacity-0 scale-90'
    }

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-700 ${animationClasses[animation]} ${className}`}
        >
            {children}
        </div>
    )
}

export default AnimatedSection

