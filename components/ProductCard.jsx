'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // calculate the average rating of the product
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto block'>
            <div className='relative bg-gradient-to-br from-slate-50 to-slate-100 h-40 sm:w-60 sm:h-68 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200/50 group-hover:border-green-300 transition-all duration-300 card-shadow'>
                {/* Hover overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/5 group-hover:to-emerald-400/5 transition-all duration-300'></div>
                
                {/* Shimmer effect on hover */}
                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                </div>
                
                <Image 
                    width={500} 
                    height={500} 
                    className='max-h-30 sm:max-h-40 w-auto group-hover:scale-110 transition-transform duration-500 relative z-10' 
                    src={product.images[0]} 
                    alt="" 
                />
                
                {/* Discount badge if needed */}
                <div className='absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
                    HOT
                </div>
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-3 max-w-60'>
                <div className='flex-1'>
                    <p className='font-medium group-hover:text-green-600 transition-colors line-clamp-2'>{product.name}</p>
                    <div className='flex items-center gap-1 mt-1'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon 
                                key={index} 
                                size={14} 
                                className='text-transparent transition-transform group-hover:scale-110' 
                                style={{transitionDelay: `${index * 50}ms`}}
                                fill={rating >= index + 1 ? "#10b981" : "#D1D5DB"} 
                            />
                        ))}
                        <span className='text-xs text-slate-500 ml-1'>({product.rating.length})</span>
                    </div>
                </div>
                <p className='font-bold text-green-600 text-base'>{currency}{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard