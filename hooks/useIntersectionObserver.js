/**
 * Custom Hook: useIntersectionObserver
 * 
 * Performance-optimized hook for detecting when elements enter the viewport
 * Follows React best practices for custom hooks
 * 
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} [ref, isIntersecting] - Ref to attach to element and intersection state
 */

import { useEffect, useRef, useState } from 'react'

export const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const targetRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }, {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px',
            ...options
        })

        const currentTarget = targetRef.current

        if (currentTarget) {
            observer.observe(currentTarget)
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget)
            }
        }
    }, [options.threshold, options.rootMargin])

    return [targetRef, isIntersecting]
}

export default useIntersectionObserver

