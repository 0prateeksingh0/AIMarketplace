'use client'
import { useState } from 'react'

/**
 * Button with Material Design Ripple Effect
 * Best practice for tactile feedback
 */
const RippleButton = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'primary',
    disabled = false,
    ariaLabel,
    type = 'button'
}) => {
    const [ripples, setRipples] = useState([])

    const variants = {
        primary: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white',
        secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white',
        outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50',
        ghost: 'text-slate-600 hover:bg-slate-100'
    }

    const handleClick = (e) => {
        if (disabled) return

        const button = e.currentTarget
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const newRipple = {
            x,
            y,
            id: Date.now()
        }

        setRipples(prev => [...prev, newRipple])

        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)

        if (onClick) onClick(e)
    }

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`
                relative overflow-hidden
                px-6 py-3 rounded-full
                font-semibold
                transition-all duration-300
                hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${variants[variant]}
                ${className}
            `}
        >
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="absolute bg-white rounded-full animate-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '20px',
                        height: '20px',
                        transform: 'translate(-50%, -50%) scale(0)',
                        opacity: 0.6
                    }}
                />
            ))}
            <span className="relative z-10">{children}</span>
        </button>
    )
}

export default RippleButton

