import { categories } from "@/assets/assets";

const CategoriesMarquee = () => {

    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
            <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-r from-white via-white/80 to-transparent" />
            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4" >
                {[...categories, ...categories, ...categories, ...categories].map((company, index) => (
                    <button 
                        key={index} 
                        className="relative px-6 py-2.5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs sm:text-sm font-medium hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 hover:text-white hover:border-transparent hover:scale-110 hover:shadow-lg active:scale-95 transition-all duration-300 overflow-hidden group/btn"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                        <span className="relative z-10">{company}</span>
                    </button>
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-32 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;