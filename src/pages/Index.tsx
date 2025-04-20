
import React from "react";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { AuctionSection } from "@/components/home/AuctionSection";
import { FeaturedCards } from "@/components/home/FeaturedCards";
import { CreatorSection } from "@/components/home/CreatorSection";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export default function Index() {
  return (
    <div className="bg-white flex flex-col overflow-hidden items-center">
      <Navbar />
      <main>
        <Hero />
        <AuctionSection />
        <FeaturedCards />
        <CreatorSection />
        <CollectionsSection />
        <DiscoverSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
