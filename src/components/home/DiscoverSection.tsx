
import React, { useState } from "react";
import { CardItem } from "../shared/CardItem";
import { useCards } from "@/hooks/useCards";
import { Skeleton } from "@/components/ui/skeleton";

export const DiscoverSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { cards, loading } = useCards();
  
  const categories = [
    "All Categories",
    "Art",
    "Game",
    "Photography",
    "Music",
    "Video",
  ];
  
  // Stable fallback data to prevent flickering
  const fallbackCards = [
    {
      id: 'fallback-1',
      title: "Magic Mushroom #3241",
      price: "1.5 ETH",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80",
      stock: "3 in stock",
      highestBid: "0.001 ETH",
    },
    {
      id: 'fallback-2',
      title: "Happy Robot 032",
      price: "1.5 ETH",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=300&q=80",
      stock: "3 in stock",
      highestBid: "0.001 ETH",
    },
    {
      id: 'fallback-3',
      title: "Happy Robot 024",
      price: "1.5 ETH",
      image: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=300&q=80",
      stock: "3 in stock",
      highestBid: "0.001 ETH",
    },
    {
      id: 'fallback-4',
      title: "Happy Robot 029",
      price: "1.5 ETH",
      image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=300&q=80",
      stock: "3 in stock",
      highestBid: "0.001 ETH",
    },
  ];

  // Use real data if available, otherwise use fallback
  const displayCards = cards && cards.length > 0 
    ? cards.slice(0, 8).map(card => ({
        id: card.id,
        title: card.title,
        price: "1.5 ETH", // Default price since Card interface doesn't have price
        image: card.image_url || card.thumbnail_url || fallbackCards[0].image,
        stock: "3 in stock",
        highestBid: "0.001 ETH",
      }))
    : fallbackCards.concat(fallbackCards).slice(0, 8);

  return (
    <div className="bg-[#141416] flex flex-col overflow-hidden pt-32 pb-12 px-4 md:px-8 lg:px-[352px] max-md:max-w-full">
      <div className="self-stretch flex w-full justify-between items-center gap-5 mb-10 max-md:max-w-full max-md:flex-wrap">
        <div className="text-[#FCFCFD] text-2xl font-bold leading-8 tracking-[-0.24px] max-md:max-w-full">
          Discover
        </div>
        <div className="flex gap-2 items-center max-md:flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  category === selectedCategory
                    ? "bg-[#353945] text-[#FCFCFD]"
                    : "text-[#777E90] hover:text-[#FCFCFD]"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-[#FCFCFD] text-sm font-semibold ml-4 px-4 py-2 rounded-lg border border-[#353945] hover:border-[#777E90] transition-colors">
            <span>Filter</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-md:max-w-full">
        {loading ? (
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="w-full">
              <Skeleton className="w-full h-[270px] rounded-t-2xl bg-[#353945]" />
              <div className="bg-[#23262F] p-5 rounded-b-2xl">
                <Skeleton className="w-3/4 h-6 mb-2 bg-[#353945]" />
                <Skeleton className="w-1/2 h-4 bg-[#353945]" />
              </div>
            </div>
          ))
        ) : (
          displayCards.map((card, index) => (
            <CardItem
              key={card.id || `card-${index}`}
              title={card.title}
              price={card.price}
              image={card.image}
              stock={card.stock}
              highestBid={card.highestBid}
            />
          ))
        )}
      </div>
      
      <button className="self-center text-[#FCFCFD] font-extrabold text-lg border-2 border-[#353945] px-6 py-4 rounded-[90px] mt-16 hover:border-[#777E90] transition-colors">
        Load more
      </button>
    </div>
  );
};
