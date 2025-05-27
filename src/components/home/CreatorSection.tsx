import React from "react";
import { CreatorBox } from "../shared/CreatorBox";
import { useCreators } from "@/hooks/useCreators";
import { Skeleton } from "@/components/ui/skeleton";

export const CreatorSection: React.FC = () => {
  const { popularCreators, loading } = useCreators();

  // Fallback data
  const fallbackCreators = [
    {
      rank: 1,
      name: "@randomdash",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/d95bd2a5c1fda0f04a12b61d44ee1d9ad2acd3af?placeholderIfAbsent=true",
      credits: "2456",
      badgeColor: "#3772FF",
    },
    {
      rank: 2,
      name: "@tranmautritam",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/f6caac64d16e17f3f15df6f4d5025ff7abc64fa5?placeholderIfAbsent=true",
      credits: "2456",
      badgeColor: "#9757D7",
    },
    {
      rank: 3,
      name: "@aaronfinch",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/61c3d18b79da00e4d4a71ab2c4f04cf9a7da8c20?placeholderIfAbsent=true",
      credits: "2456",
      badgeColor: "#45B26B",
    },
    {
      rank: 4,
      name: "@chrisferrel",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/dc93ec7df0f6fef1c98de06c8c9d95cd2ac44f34?placeholderIfAbsent=true",
      credits: "2456",
      badgeColor: "#23262F",
    },
  ];

  // Map real data or use fallback
  const creators = popularCreators.length > 0 
    ? popularCreators.map((creator, index) => ({
        rank: index + 1,
        name: creator.username ? `@${creator.username}` : `@${creator.full_name?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
        avatar: creator.avatar_url || fallbackCreators[index % fallbackCreators.length].avatar,
        credits: "2456", // Placeholder
        badgeColor: fallbackCreators[index % fallbackCreators.length].badgeColor,
      }))
    : fallbackCreators;

  return (
    <div className="bg-[#141416] flex flex-col overflow-hidden pt-32 pb-12 px-[352px] max-md:max-w-full max-md:px-5">
      <div className="self-stretch flex w-full justify-between items-center gap-5 max-md:max-w-full max-md:flex-wrap">
        <div className="text-[#FCFCFD] text-2xl font-bold leading-8 tracking-[-0.24px] max-md:max-w-full">
          Popular Creators
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
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="w-[270px] bg-[#23262F] p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="w-20 h-5 mb-1" />
                  <Skeleton className="w-12 h-3" />
                </div>
              </div>
              <Skeleton className="w-full h-4 mt-2" />
            </div>
          ))
        ) : (
          creators.map((creator, index) => (
            <CreatorBox
              key={index}
              rank={creator.rank}
              name={creator.name}
              avatar={creator.avatar}
              credits={creator.credits}
              badgeColor={creator.badgeColor}
            />
          ))
        )}
      </div>
    </div>
  );
};
