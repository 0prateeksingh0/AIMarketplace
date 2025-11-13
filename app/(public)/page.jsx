'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
    return (
        <div>
            <AnimatedSection animation="fade-in" delay={0}>
                <Hero />
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={100}>
                <LatestProducts />
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={150}>
                <BestSelling />
            </AnimatedSection>
            
            <AnimatedSection animation="scale" delay={100}>
                <OurSpecs />
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={100}>
                <Newsletter />
            </AnimatedSection>
        </div>
    );
}
