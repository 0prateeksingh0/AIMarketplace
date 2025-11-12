import React from 'react'
import Title from './Title'

const Newsletter = () => {
    return (
        <div className='relative flex flex-col items-center mx-4 sm:mx-6 my-36'>
            {/* Decorative background */}
            <div className='absolute inset-0 max-w-4xl mx-auto bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 rounded-3xl blur-3xl opacity-30'></div>
            
            <div className='relative z-10 flex flex-col items-center max-w-3xl mx-auto'>
                <Title title="Join Newsletter" description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week." visibleButton={false} />
                
                <div className='relative w-full max-w-xl my-10 group'>
                    {/* Animated gradient border */}
                    <div className='absolute -inset-0.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-300 animate-gradient'></div>
                    
                    <div className='relative flex bg-white text-sm p-1.5 rounded-full w-full shadow-xl'>
                        <input 
                            className='flex-1 pl-6 py-3 outline-none bg-transparent placeholder-slate-400 text-slate-700' 
                            type="email" 
                            placeholder='Enter your email address' 
                            required
                        />
                        <button className='font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2'>
                            <span>Get Updates</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33203 8H12.6654M12.6654 8L8.66536 4M12.6654 8L8.66536 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Trust indicators */}
                <div className='flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 mt-4'>
                    <div className='flex items-center gap-2'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.6654 7.38672V8.00005C14.6645 9.43769 14.2001 10.8365 13.3395 11.9879C12.4788 13.1393 11.2688 13.9817 9.89022 14.3893C8.51166 14.797 7.03815 14.748 5.68963 14.2498C4.3411 13.7516 3.18975 12.8308 2.40729 11.6247C1.62482 10.4186 1.25317 8.99205 1.34776 7.55762C1.44235 6.12319 1.99812 4.75762 2.93217 3.66479C3.86621 2.57195 5.1285 1.81033 6.53077 1.4935C7.93304 1.17668 9.40016 1.32163 10.7121 1.90672M14.6654 2.66672L7.9987 9.34005L5.9987 7.34005" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>No spam, ever</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.9987 10.6667C9.47146 10.6667 10.6654 9.47276 10.6654 8.00001C10.6654 6.52725 9.47146 5.33334 7.9987 5.33334C6.52594 5.33334 5.33203 6.52725 5.33203 8.00001C5.33203 9.47276 6.52594 10.6667 7.9987 10.6667Z" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.9987 1.33334V2.66668M7.9987 13.3333V14.6667M3.28537 3.28668L4.2287 4.23001M11.7687 11.77L12.712 12.7133M1.33203 8.00001H2.66536M13.332 8.00001H14.6654M3.28537 12.7133L4.2287 11.77M11.7687 4.23001L12.712 3.28668" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Exclusive deals only</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.6654 7.33334V4.00001C12.6654 3.64639 12.5249 3.30725 12.2748 3.0572C12.0248 2.80715 11.6857 2.66668 11.332 2.66668H2.66536C2.31174 2.66668 1.9726 2.80715 1.72256 3.0572C1.47251 3.30725 1.33203 3.64639 1.33203 4.00001V10.6667C1.33203 11.0203 1.47251 11.3594 1.72256 11.6095C1.9726 11.8595 2.31174 12 2.66536 12H5.9987M9.9987 14.6667L14.6654 10M14.6654 10V13.3333M14.6654 10H11.332" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Unsubscribe anytime</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Newsletter