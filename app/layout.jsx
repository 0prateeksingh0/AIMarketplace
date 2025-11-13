import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "AIMarketplace - Shop Smarter with AI-Powered Multi-Vendor Platform",
    description: "Discover the best gadgets and tech products on AIMarketplace. A modern multi-vendor e-commerce platform featuring smartphones, laptops, accessories and more with secure checkout and fast shipping.",
    keywords: "online shopping, multi-vendor marketplace, gadgets, tech products, e-commerce, smartphones, laptops, accessories",
    authors: [{ name: "AIMarketplace Team" }],
    openGraph: {
        title: "AIMarketplace - Shop Smarter",
        description: "Your ultimate destination for the latest gadgets and tech products",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <Toaster />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
