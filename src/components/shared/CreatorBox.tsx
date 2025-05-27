
import React from "react";

interface CreatorBoxProps {
  rank: number;
  name: string;
  avatar: string;
  credits: string;
  badgeColor?: string;
}

export const CreatorBox: React.FC<CreatorBoxProps> = ({
  rank,
  name,
  avatar,
  credits,
  badgeColor = "#3772FF",
}) => {
  return (
    <div className="justify-center items-stretch bg-[#141416] flex flex-col flex-1 shrink basis-[0%] p-6 rounded-2xl">
      <div className="flex w-full gap-[40px_43px] justify-between">
        <div
          className="justify-center items-center flex gap-1 text-xs text-[#FCFCFD] font-semibold whitespace-nowrap leading-loose px-2 py-0.5 rounded-3xl"
          style={{ backgroundColor: badgeColor }}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/94f224de7efad6165e587ff1926753fd107dcd4f?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
            alt="Rank icon"
          />
          <div className="self-stretch my-auto">#{rank}</div>
        </div>
        <div className="flex gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/cafe2d69814c15a82a374bd3d50aef8c20cd138d?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-6 shrink-0"
            alt="Follow"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/03cc77d85c94cb8595dcf37a75764986c6d303aa?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-6 shrink-0"
            alt="View"
          />
        </div>
      </div>
      <div className="bg-[#353945] flex min-h-px w-full mt-6" />
      <div className="flex w-full flex-col items-center whitespace-nowrap mt-6">
        <img
          src={avatar}
          className="aspect-[1] object-contain w-16 rounded-[64px]"
          alt={name}
        />
        <div className="flex w-full max-w-[152px] flex-col items-stretch justify-center mt-4">
          <div className="flex w-full items-center gap-1 text-sm text-[#FCFCFD] font-medium leading-6 justify-center">
            {name}
          </div>
          <div className="flex w-full items-center gap-0.5 text-xs leading-loose justify-center">
            <div className="text-[#E6E8EC] font-semibold self-stretch my-auto">
              {credits}
            </div>
            <div className="text-[#777E90] font-normal self-stretch my-auto">
              C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
