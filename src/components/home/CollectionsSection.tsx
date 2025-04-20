
import React from "react";
import { useHotCollections } from "@/hooks/useCollections";
import { Skeleton } from "@/components/ui/skeleton";

export const CollectionsSection: React.FC = () => {
  const { hotCollections, loading } = useHotCollections();

  // Fallback data
  const fallbackCollections = [
    {
      title: "Awesome Collection",
      owner: "@randomdash",
      items: 28,
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/c53d34af6eeaf5de2e7c1dd33b25a4a97a8b6f85?placeholderIfAbsent=true",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/d95bd2a5c1fda0f04a12b61d44ee1d9ad2acd3af?placeholderIfAbsent=true",
    },
    {
      title: "Card Collection",
      owner: "@tranmautritam",
      items: 28,
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/f77e9a2f29b3d6ca3e2ef7eb58bb96f8f61ae2e3?placeholderIfAbsent=true",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/f6caac64d16e17f3f15df6f4d5025ff7abc64fa5?placeholderIfAbsent=true",
    },
    {
      title: "3D Collection",
      owner: "@aaronfinch",
      items: 28,
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/bbddb7b98ca0d36e27c86999c1ba359a0f28d302?placeholderIfAbsent=true",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/61c3d18b79da00e4d4a71ab2c4f04cf9a7da8c20?placeholderIfAbsent=true",
    },
  ];

  // Map real data or use fallback
  const collections = hotCollections.length > 0 
    ? hotCollections.map((collection, index) => ({
        title: collection.title || "Unnamed Collection",
        owner: collection.profiles ? `@${collection.profiles.full_name?.toLowerCase().replace(/\s+/g, '') || 'user'}` : "@user",
        items: 28, // Placeholder
        image: collection.cover_image_url || fallbackCollections[index % fallbackCollections.length].image,
        avatar: collection.profiles?.avatar_url || fallbackCollections[index % fallbackCollections.length].avatar,
      }))
    : fallbackCollections;

  return (
    <div className="bg-[#141416] flex flex-col overflow-hidden pt-32 pb-12 px-[352px] max-md:max-w-full max-md:px-5">
      <div className="self-stretch flex w-full justify-between items-center gap-5 max-md:max-w-full max-md:flex-wrap">
        <div className="text-[#FCFCFD] text-2xl font-bold leading-8 tracking-[-0.24px] max-md:max-w-full">
          Hot Collections
        </div>
        <div className="flex gap-2">
          <button className="flex gap-2.5 p-2 rounded-[40px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/a634456f2f665b93045f6a817c79159c94b55353?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6"
              alt="Previous"
            />
          </button>
          <button className="flex gap-2.5 p-2 rounded-[40px]">
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
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col bg-[#23262F] overflow-hidden rounded-2xl w-[370px]">
              <Skeleton className="w-full h-[240px]" />
              <div className="flex flex-col p-6 gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col">
                    <Skeleton className="w-32 h-5 mb-1" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="w-12 h-4" />
                  <Skeleton className="w-8 h-4" />
                </div>
              </div>
            </div>
          ))
        ) : (
          collections.map((collection, index) => (
            <div key={index} className="flex flex-col bg-[#23262F] overflow-hidden rounded-2xl">
              <div className="bg-[#141416] flex flex-col">
                <img
                  src={collection.image}
                  className="aspect-[1.33] object-cover w-full"
                  alt={collection.title}
                />
              </div>
              <div className="flex flex-col p-6 gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={collection.avatar}
                    className="aspect-[1] object-contain w-10 rounded-full"
                    alt="Avatar"
                  />
                  <div className="flex flex-col">
                    <div className="text-[#FCFCFD] text-base font-semibold">
                      {collection.title}
                    </div>
                    <div className="text-[#777E90] text-xs">
                      {collection.owner}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-[#777E90] text-xs">
                    Items
                  </div>
                  <div className="text-[#FCFCFD] text-sm font-semibold">
                    {collection.items}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
