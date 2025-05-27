
import React from "react";

const formatCredits = (amount: number | string) => {
  const n = typeof amount === "number" ? amount : parseInt(amount);
  return (
    <>
      <span className="align-middle">{n}</span>
      <span className="ml-1">C</span>
    </>
  );
};

interface CardItemProps {
  title: string;
  price: string;
  image: string;
  stock?: string;
  highestBid?: string;
  avatars?: string[];
}

export const CardItem: React.FC<CardItemProps> = ({
  title,
  price,
  image,
  stock = "3 in stock",
  highestBid = "10",
  avatars = [],
}) => {
  return (
    <div className="self-stretch flex min-w-60 flex-col items-stretch justify-center grow shrink w-[205px] my-auto">
      <div className="justify-center items-stretch bg-[#CDB4DB] flex w-full flex-col overflow-hidden rounded-2xl">
        <img
          src={image}
          className="aspect-[0.84] object-contain w-full"
          alt={title}
        />
      </div>
      <div className="flex w-full flex-col items-stretch justify-center py-5 rounded-[0px_0px_16px_16px]">
        <div className="flex w-full items-center gap-1.5 font-semibold justify-between">
          <div className="text-[#FCFCFD] text-base self-stretch w-[184px] my-auto">
            {title}
          </div>
          <div className="self-stretch rounded gap-2.5 text-xs text-[#45B26B] uppercase leading-none my-auto pt-2 pb-1.5 px-2 flex items-center">
            {formatCredits(price)}
          </div>
        </div>
        <div className="flex w-full items-center gap-3 mt-3">
          {avatars.length > 0 ? (
            <div className="self-stretch flex items-stretch flex-1 shrink basis-[0%] my-auto pr-11">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  className="aspect-[1] object-contain w-6 shrink-0 max-md:-mr-2"
                  alt={`Avatar ${index + 1}`}
                />
              ))}
            </div>
          ) : (
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/da33ffd96da5d705f430a0416c8e2f57c38ce296?placeholderIfAbsent=true"
              className="aspect-[7.35] object-contain w-[177px] self-stretch shrink flex-1 basis-[0%] my-auto"
              alt="Avatars"
            />
          )}
          <div className="text-[#E6E8EC] text-sm font-medium leading-6 self-stretch my-auto">
            {stock}
          </div>
        </div>
        <div className="bg-[#353945] flex min-h-px w-full mt-3 rounded-[1px]" />
        <div className="flex w-full items-center gap-10 text-xs leading-loose justify-between mt-3">
          <div className="self-stretch flex items-center gap-1 my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/9202e09deb31056539d3a9c1f50c119094e7e5d3?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Bid icon"
            />
            <div className="text-[#777E90] font-normal self-stretch my-auto">
              Highest bid
            </div>
            <div className="text-[#FCFCFD] font-semibold self-stretch my-auto flex items-center">
              {formatCredits(highestBid ?? 0)}
            </div>
          </div>
          <div className="self-stretch gap-1 text-[#777E90] font-normal my-auto">
            New bid 🔥
          </div>
        </div>
      </div>
    </div>
  );
};
