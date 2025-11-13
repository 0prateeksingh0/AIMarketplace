/**
 * Animation Utilities
 * 
 * Centralized animation configurations and utilities
 * Following DRY (Don't Repeat Yourself) principles
 */

// Stagger animation delays for lists
export const getStaggerDelay = (index, baseDelay = 50) => {
    return `${index * baseDelay}ms`
}

// Easing functions
export const easings = {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
}

// Animation duration presets
export const durations = {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 700
}

// Common animation variants for Framer Motion (if needed in future)
export const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
}

export const scaleInVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
}

// Page transition variants
export const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
}

// Scroll reveal configuration
export const scrollRevealConfig = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
}

export default {
    getStaggerDelay,
    easings,
    durations,
    fadeInUpVariant,
    fadeInVariant,
    scaleInVariant,
    pageTransition,
    scrollRevealConfig
}

