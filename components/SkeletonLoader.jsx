'use client'

/**
 * Skeleton Loader Components for Better Loading States
 * Follows best practices for perceived performance
 */

export const ProductCardSkeleton = () => {
    return (
        <div className="max-xl:mx-auto animate-pulse">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-40 sm:w-60 sm:h-68 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="w-32 h-32 bg-slate-300 rounded-lg"></div>
            </div>
            <div className="flex justify-between gap-3 pt-3 max-w-60">
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-slate-200 rounded-full"></div>
                        ))}
                    </div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-12"></div>
            </div>
        </div>
    )
}

export const HeroSkeleton = () => {
    return (
        <div className="mx-6 animate-pulse">
            <div className="max-w-7xl mx-auto my-10">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl h-96 flex items-center justify-center">
                    <div className="space-y-4 p-16">
                        <div className="h-8 bg-slate-300 rounded w-64"></div>
                        <div className="h-12 bg-slate-300 rounded w-96"></div>
                        <div className="h-16 bg-slate-300 rounded w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const TitleSkeleton = () => {
    return (
        <div className="flex flex-col items-center animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded w-64"></div>
            <div className="h-4 bg-slate-200 rounded w-96"></div>
        </div>
    )
}

export const FooterSkeleton = () => {
    return (
        <div className="mx-6 mt-20">
            <div className="bg-slate-800 rounded-3xl p-16 animate-pulse">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex justify-between">
                        <div className="space-y-4">
                            <div className="h-8 bg-slate-700 rounded w-32"></div>
                            <div className="h-20 bg-slate-700 rounded w-96"></div>
                        </div>
                        <div className="flex gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="h-6 bg-slate-700 rounded w-24"></div>
                                    <div className="space-y-2">
                                        {[...Array(4)].map((_, j) => (
                                            <div key={j} className="h-4 bg-slate-700 rounded w-32"></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default {
    ProductCardSkeleton,
    HeroSkeleton,
    TitleSkeleton,
    FooterSkeleton
}

