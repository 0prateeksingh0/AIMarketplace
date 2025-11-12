'use client'
import React from 'react'
import toast from 'react-hot-toast';

export default function Banner() {

    const [isOpen, setIsOpen] = React.useState(true);

    const handleClaim = () => {
        setIsOpen(false);
        toast.success('Coupon copied to clipboard!');
        navigator.clipboard.writeText('NEW20');
    };

    return isOpen && (
        <div className="relative w-full px-6 py-3 font-medium text-sm text-white text-center bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></div>
            </div>
            
            <div className='relative z-10 flex items-center justify-between max-w-7xl mx-auto'>
                <div className='flex items-center gap-3 max-sm:flex-1'>
                    <span className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30 max-sm:hidden animate-pulse-glow'>🎉 LIMITED TIME</span>
                    <p className='font-semibold'>Get <span className='bg-white/30 px-2 py-0.5 rounded font-bold'>20% OFF</span> on Your First Order!</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={handleClaim} 
                        type="button" 
                        className="font-semibold text-purple-600 bg-white px-6 py-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl max-sm:hidden"
                    >
                        Claim Offer
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        type="button" 
                        className="font-normal p-1 rounded-full hover:bg-white/20 transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="#fff" />
                            <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="#fff" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};