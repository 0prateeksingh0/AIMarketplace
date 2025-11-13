'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800 animate-fade-in-up">

            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <table className="w-full max-w-4xl text-slate-600 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm">
                                <th className="text-left">Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th className="max-md:hidden">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartArray.map((item, index) => (
                                    <tr 
                                        key={index} 
                                        className="space-x-2 animate-fade-in-scale hover:bg-slate-50 transition-colors group"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <td className="flex gap-3 my-4">
                                            <div className="flex gap-3 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 size-18 rounded-xl border border-slate-200 group-hover:border-green-300 transition-all group-hover:scale-105">
                                                <Image src={item.images[0]} className="h-14 w-auto" alt={item.name} width={45} height={45} />
                                            </div>
                                            <div>
                                                <p className="max-sm:text-sm font-medium group-hover:text-green-600 transition-colors">{item.name}</p>
                                                <p className="text-xs text-slate-500 mt-1 px-2 py-0.5 bg-slate-100 rounded-full inline-block">{item.category}</p>
                                                <p className="mt-1 font-semibold text-green-600">{currency}{item.price}</p>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Counter productId={item.id} />
                                        </td>
                                        <td className="text-center font-bold text-slate-800">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                        <td className="text-center max-md:hidden">
                                            <button 
                                                onClick={() => handleDeleteItemFromCart(item.id)} 
                                                className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all hover:scale-110 group/btn"
                                                aria-label="Remove item from cart"
                                            >
                                                <Trash2Icon size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex flex-col items-center justify-center text-slate-400 animate-fade-in-scale">
            <div className="text-8xl mb-6 animate-float">🛒</div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent mb-4">
                Your cart is empty
            </h1>
            <p className="text-slate-500 mb-8">Looks like you haven't added anything yet</p>
            <a 
                href="/shop"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
                Start Shopping
            </a>
        </div>
    )
}