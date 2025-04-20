
import React, { useState } from "react";
import { CardItem } from "../shared/CardItem";
import { useCards } from "@/hooks/useCards";
import { Skeleton } from "@/components/ui/skeleton";

export const DiscoverSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { trendingCards, loading } = useCards();
  
  const categories = [
    "All Categories",
    "Art",
    "Game",
    "Photography",
    "Music",
    "Video",
  ];
  
  // Fallback data
  const fallbackCards = [
    {
      title: "Magic Mushroom #3241",
      price: "1.5 ETH",
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/d8f82b9c8c741a51de3f5c8f0ec3bfb7a8ce2357?placeholderIfAbsent=true",
      stock: "3 in stock",
      highestBid: "0.001 ETH",
    },
    {
      title: "Happy Robot 032",
      price: "1.5 ETH",
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/f77e9a2f29b3d6ca3e2ef7eb58bb96f8f61ae2e3?placeholderIfAbsent=true",
      stock: "3 in stock",
      highestBid: "0.001 ETH",
    },
    {
      title: "Happy Robot 024",
      price: "1.5 ETH",
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/bbddb7b98ca0d36e27c86999c1ba359a0f28d302?placeholderIfAbsent=true",
      stock: "3 in stock",
      highestBid: "0.001 ETH",
    },
    {
      title: "Happy Robot 029",
      price: "1.5 ETH",
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/47ecad8cb0d55baf48a07b5a5ad0aec67e4ab9f9?placeholderIfAbsent=true",
      stock: "3 in stock",
      highestBid: "0.001 ETH",
    },
  ];

  // Use real data or fallback
  let displayCards = trendingCards.length > 0 
    ? trendingCards.map(card => ({
        title: card.title,
        price: card.price ? `${card.price} ETH` : "1.5 ETH",
        image: card.image_url || card.thumbnail_url || fallbackCards[0].image,
        stock: "3 in stock",
        highestBid: "0.001 ETH",
      }))
    : fallbackCards;

  // Duplicate cards to have 8 items for display
  if (displayCards.length < 8) {
    const additionalCards = [...displayCards];
    while (displayCards.length + additionalCards.length < 8) {
      additionalCards.push(...displayCards);
    }
    displayCards = [...displayCards, ...additionalCards.slice(0, 8 - displayCards.length)];
  }

  return (
    <div className="bg-[#141416] flex flex-col overflow-hidden pt-32 pb-12 px-[352px] max-md:max-w-full max-md:px-5">
      <div className="self-stretch flex w-full justify-between items-center gap-5 mb-10 max-md:max-w-full max-md:flex-wrap">
        <div className="text-[#FCFCFD] text-2xl font-bold leading-8 tracking-[-0.24px] max-md:max-w-full">
          Discover
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  category === selectedCategory
                    ? "bg-[#353945] text-[#FCFCFD]"
                    : "text-[#777E90]"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-[#FCFCFD] text-sm font-semibold ml-4 px-4 py-2 rounded-lg border border-[#353945]">
            <span>Filter</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/47e4f562a9a30a61d4e5be4c6812e7a8e24e40d9?placeholderIfAbsent=true"
              className="w-5 h-5"
              alt="Filter"
            />
          </button>
        </div>
      </div>
      
      <div className="self-stretch flex flex-wrap w-full items-stretch justify-between gap-8 max-md:max-w-full">
        {loading ? (
          // Loading state
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="w-[270px] h-[366px]">
              <Skeleton className="w-full h-[270px] rounded-t-2xl" />
              <div className="bg-[#23262F] p-5 rounded-b-2xl">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
          ))
        ) : (
          displayCards.map((card, index) => (
            <CardItem
              key={index}
              title={card.title}
              price={card.price}
              image={card.image}
              stock={card.stock}
              highestBid={card.highestBid}
            />
          ))
        )}
      </div>
      
      <button className="self-center text-[#FCFCFD] font-extrabold text-lg border-2 border-[#353945] px-6 py-4 rounded-[90px] mt-16">
        Load more
      </button>
    </div>
  );
};
