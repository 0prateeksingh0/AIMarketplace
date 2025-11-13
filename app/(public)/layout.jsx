'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function PublicLayout({ children }) {

    return (
        <>
            <Banner />
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </>
    );
}
