import React from "react";
import { CardItem } from "../shared/CardItem";
import { useCards } from "@/hooks/useCards";
import { useTheme } from "@/contexts/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const FeaturedCards: React.FC = () => {
  const { featuredCards, loading } = useCards();
  const { theme } = useTheme();

  // Fallback data in case the API returns empty
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

  // Use real data if available, otherwise fallback to mock data
  const cards = featuredCards.length > 0 ? featuredCards.map(card => ({
    title: card.title,
    price: "1.5 ETH", // Default price since Card interface doesn't have price
    image: card.image_url || card.thumbnail_url || fallbackCards[0].image,
    stock: "3 in stock",
    highestBid: "0.001 ETH",
  })) : fallbackCards;

  return (
    <div className={cn(
      "flex flex-col overflow-hidden pt-32 pb-12 px-4 md:px-[352px] max-md:max-w-full",
      "theme-bg-secondary"
    )}>
      <div className="self-stretch flex w-full justify-between items-center gap-5 max-md:max-w-full max-md:flex-wrap">
        <div className="theme-text-primary text-2xl font-bold leading-8 tracking-[-0.24px] max-md:max-w-full">
          Featured cards
        </div>
        <div className="flex gap-2">
          <button className="flex gap-2.5 p-2 rounded-[40px] hover:theme-bg-accent transition-colors">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/a634456f2f665b93045f6a817c79159c94b55353?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6"
              alt="Previous"
            />
          </button>
          <button className="flex gap-2.5 p-2 rounded-[40px] hover:theme-bg-accent transition-colors">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/383525dbc8a15dc754c80a44d3eb6153844d0aed?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6"
              alt="Next"
            />
          </button>
        </div>
      </div>
      <div className="self-stretch flex flex-wrap w-full items-stretch justify-between gap-8 mt-10 max-md:max-w-full">
        {loading ? (
          // Loading state
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="w-[270px] h-[366px]">
              <Skeleton className="w-full h-[270px] rounded-t-2xl" />
              <div className="theme-bg-accent p-5 rounded-b-2xl">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
          ))
        ) : (
          cards.map((card, index) => (
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
    </div>
  );
};
