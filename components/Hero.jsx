'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-6 animate-fade-in-up'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <div className='relative flex-1 flex flex-col bg-gradient-to-br from-green-100 via-green-200 to-emerald-300 rounded-3xl xl:min-h-100 group overflow-hidden card-shadow hover:scale-[1.02] transition-all duration-300'>
                    {/* Animated background elements */}
                    <div className='absolute top-10 right-20 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-float'></div>
                    <div className='absolute bottom-20 left-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl animate-float' style={{animationDelay: '1s'}}></div>
                    
                    <div className='p-5 sm:p-16 relative z-10'>
                        <div className='inline-flex items-center gap-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white pr-4 p-1 rounded-full text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer'>
                            <span className='bg-white px-3 py-1 max-sm:ml-1 rounded-full text-green-600 text-xs font-bold flex items-center gap-1'>
                                <Sparkles size={12} />
                                NEWS
                            </span> 
                            Free Shipping on Orders Above $50! 
                            <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-5 sm:my-6 font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-green-600 bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                            Gadgets you'll love. Prices you'll trust.
                        </h2>
                        <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8 flex items-end gap-2'>
                            <div>
                                <p className='text-slate-600'>Starts from</p>
                                <p className='text-4xl sm:text-5xl font-bold text-green-600'>{currency}4.90</p>
                            </div>
                            <Zap className='text-yellow-500 mb-2' size={24} fill='currentColor' />
                        </div>
                        <button className='bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold py-3 px-8 sm:py-5 sm:px-14 mt-6 sm:mt-10 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2'>
                            LEARN MORE 
                            <ArrowRightIcon size={16} />
                        </button>
                    </div>
                    <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm group-hover:scale-110 transition-transform duration-500' src={assets.hero_model_img} alt="" />
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-orange-100 via-orange-200 to-amber-300 rounded-3xl p-6 px-8 group overflow-hidden card-shadow hover:scale-105 transition-all duration-300 cursor-pointer relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                        <div className='relative z-10'>
                            <p className='text-3xl font-bold bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent max-w-40'>Best products</p>
                            <p className='flex items-center gap-1 mt-4 font-medium text-slate-700 group-hover:gap-3 transition-all'>
                                View more 
                                <ArrowRightIcon className='group-hover:translate-x-1 transition-all' size={18} /> 
                            </p>
                        </div>
                        <Image className='w-35 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-300 rounded-3xl p-6 px-8 group overflow-hidden card-shadow hover:scale-105 transition-all duration-300 cursor-pointer relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                        <div className='relative z-10'>
                            <p className='text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent max-w-40'>20% discounts</p>
                            <p className='flex items-center gap-1 mt-4 font-medium text-slate-700 group-hover:gap-3 transition-all'>
                                View more 
                                <ArrowRightIcon className='group-hover:translate-x-1 transition-all' size={18} /> 
                            </p>
                        </div>
                        <Image className='w-35 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300' src={assets.hero_product_img2} alt="" />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero