'use client'

const Loading = () => {

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50'>
            <div className='relative'>
                {/* Outer ring */}
                <div className='w-20 h-20 rounded-full border-4 border-gray-200 border-t-green-500 animate-spin'></div>
                
                {/* Inner ring */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-gray-100 border-t-emerald-400 animate-spin' style={{animationDirection: 'reverse', animationDuration: '0.6s'}}></div>
                
                {/* Center dot */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 animate-pulse'></div>
            </div>
            
            {/* Loading text */}
            <div className='mt-8 flex items-center gap-2'>
                <span className='text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                    Loading
                </span>
                <div className='flex gap-1'>
                    <span className='w-2 h-2 rounded-full bg-green-500 animate-bounce' style={{animationDelay: '0s'}}></span>
                    <span className='w-2 h-2 rounded-full bg-green-500 animate-bounce' style={{animationDelay: '0.2s'}}></span>
                    <span className='w-2 h-2 rounded-full bg-green-500 animate-bounce' style={{animationDelay: '0.4s'}}></span>
                </div>
            </div>
        </div>
    )
}

export default Loading