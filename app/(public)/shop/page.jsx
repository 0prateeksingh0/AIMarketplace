'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

 function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)

    const filteredProducts = search
        ? products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        : products;

    return (
        <div className="min-h-[70vh] mx-6 animate-fade-in-up">
            <div className="max-w-7xl mx-auto">
                <div className="my-10 flex items-center justify-between flex-wrap gap-4">
                    <h1 
                        onClick={() => router.push('/shop')} 
                        className="text-3xl text-slate-500 flex items-center gap-3 cursor-pointer group transition-all hover:text-slate-700"
                    >
                        {search && (
                            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-green-100 transition-colors">
                                <MoveLeftIcon size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </div>
                        )}
                        All <span className="text-slate-700 font-bold bg-gradient-to-r from-slate-700 to-green-600 bg-clip-text text-transparent">Products</span>
                    </h1>
                    
                    {search && (
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium animate-bounce-in">
                            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{search}"
                        </div>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                        {filteredProducts.map((product, index) => (
                            <div 
                                key={product.id} 
                                className="animate-fade-in-scale"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-fade-in-scale">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-semibold mb-2">No products found</h2>
                        <p className="text-sm">Try adjusting your search</p>
                    </div>
                )}
            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}