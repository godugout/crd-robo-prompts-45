
import React from "react";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { EmbeddedCardCreator } from "@/components/home/EmbeddedCardCreator";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";
import { Footer } from "@/components/home/Footer";

export default function Index() {
  console.log('Index page rendering - homepage loaded successfully');
  
  return (
    <div className="bg-[#141416] min-h-screen flex flex-col overflow-hidden items-center">
      <main className="w-full">
        <EnhancedHero />
        <EmbeddedCardCreator />
        <SimplifiedCTA />
      </main>
      <Footer />
    </div>
  );
}
