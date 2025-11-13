'use client'
import { Search, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const [scrolled, setScrolled] = useState(false)
    const cartCount = useSelector(state => state.cart.total)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-effect shadow-lg' : 'bg-white'}`}>
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700 hover:scale-105 transition-transform">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-1 text-white bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse-glow">
                            <Sparkles size={10} />
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600 font-medium">
                        <Link href="/" className="hover:text-green-600 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded px-2 py-1">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/shop" className="hover:text-green-600 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded px-2 py-1">
                            Shop
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/" className="hover:text-green-600 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded px-2 py-1">
                            About
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/" className="hover:text-green-600 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded px-2 py-1">
                            Contact
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-green-300">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-500" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-green-600 transition-all hover:scale-105">
                            <ShoppingCart size={18} />
                            Cart
                            <span className="absolute -top-1 left-3 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{cartCount}</span>
                        </Link>

                        <button className="px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                            Login
                        </button>

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden">
                        <button className="px-7 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-sm transition-all text-white rounded-full shadow-md hover:shadow-lg">
                            Login
                        </button>
                    </div>
                </div>
            </div>
            <hr className="border-gray-200" />
        </nav>
    )
}

export default Navbar