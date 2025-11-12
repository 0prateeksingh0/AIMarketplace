import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title='Our Specifications' description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <div 
                                className='relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border-2 rounded-2xl group overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer' 
                                style={{ backgroundColor: spec.accent + 10, borderColor: spec.accent + 30 }} 
                                key={index}
                            >
                                {/* Hover gradient overlay */}
                                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ background: `linear-gradient(135deg, ${spec.accent}15, ${spec.accent}05)` }}></div>
                                
                                {/* Shimmer effect */}
                                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                                </div>
                                
                                <div className='relative z-10'>
                                    <h3 className='text-slate-800 font-semibold text-lg group-hover:scale-105 transition-transform duration-300'>{spec.title}</h3>
                                    <p className='text-sm text-slate-600 mt-3 leading-relaxed'>{spec.description}</p>
                                </div>
                                
                                <div 
                                    className='absolute -top-5 text-white size-12 flex items-center justify-center rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg' 
                                    style={{ background: `linear-gradient(135deg, ${spec.accent}, ${spec.accent}CC)` }}
                                >
                                    <spec.icon size={22} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default OurSpecs