'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-2 rounded-lg border-2 border-slate-200 hover:border-green-300 transition-all max-sm:text-sm text-slate-600 bg-white shadow-sm hover:shadow-md">
            <button 
                onClick={removeFromCartHandler} 
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-red-500 hover:text-red-600 active:scale-90 transition-all font-bold select-none focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Decrease quantity"
            >
                −
            </button>
            <p className="px-3 py-1 min-w-[2rem] text-center font-semibold text-slate-800">{cartItems[productId]}</p>
            <button 
                onClick={addToCartHandler} 
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-green-50 text-green-500 hover:text-green-600 active:scale-90 transition-all font-bold select-none focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    )
}

export default Counter