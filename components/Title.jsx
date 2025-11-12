'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, description, visibleButton = true, href = '' }) => {

    return (
        <div className='flex flex-col items-center'>
            <div className='relative inline-block'>
                <h2 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-green-600 bg-clip-text text-transparent'>
                    {title}
                </h2>
                {/* Decorative underline */}
                <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full'></div>
            </div>
            <Link href={href} className='flex flex-wrap items-center justify-center gap-5 text-sm text-slate-600 mt-6'>
                <p className='max-w-2xl text-center leading-relaxed'>{description}</p>
                {visibleButton && (
                    <button className='group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-medium'>
                        View more 
                        <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
                    </button>
                )}
            </Link>
        </div>
    )
}

export default Title