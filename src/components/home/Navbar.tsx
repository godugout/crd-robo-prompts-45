
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  return (
    <div className="bg-[#141416] w-full overflow-hidden">
      <div className="flex w-full items-center justify-between flex-wrap px-40 py-5 max-md:max-w-full max-md:px-5">
        <div className="self-stretch flex min-w-60 items-center gap-8 flex-wrap my-auto max-md:max-w-full">
          <Link to="/" className="self-stretch flex gap-2 text-lg text-[#F4F5F6] font-black whitespace-nowrap tracking-[-0.36px] leading-8 my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/c58b524115847cb6bae550e7e8d188319790873e?placeholderIfAbsent=true"
              className="aspect-[1.34] object-contain w-[43px] shrink-0"
              alt="Logo"
            />
            <div className="w-[123px]">CARDSHOW</div>
          </Link>
          <div className="bg-[#353945] self-stretch flex w-0.5 shrink-0 h-10 my-auto rounded-sm" />
          <div className="text-[#b1b5c3] text-center text-sm font-extrabold leading-none self-stretch my-auto">
            <Link to="/feed" className="underline text-[#EA6E48]">CARDS</Link>{" "}
            <Link to="/decks" className="font-semibold text-[#BDBDBD] hover:text-[#EA6E48]">MARKET</Link>{" "}
            <Link to="/collections" className="font-semibold text-[#BDBDBD] hover:text-[#EA6E48]">COLLECTIONS</Link>{" "}
            <Link to="/templates" className="font-semibold text-[#BDBDBD] hover:text-[#EA6E48]">SHOPS</Link>
          </div>
        </div>

        <div className="self-stretch flex min-w-60 gap-6 text-center flex-wrap my-auto max-md:max-w-full">
          <div className="justify-between items-center flex min-w-60 gap-[40px_100px] overflow-hidden text-xs text-[#777E90] font-normal whitespace-nowrap leading-loose w-64 pl-4 pr-3 py-2.5 rounded-lg">
            <div className="self-stretch my-auto">Search</div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/b30f2b7e744582894079841c0016d0c22eb76184?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Search"
            />
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/34fbc25a4acedf09fdae6eb6a44f243f080875a4?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-10 shrink-0"
            alt="Notification"
          />
          <div className="flex items-center gap-3 text-sm text-[#FCFCFD] font-extrabold leading-none justify-center">
            <Link to="/editor">
              <Button className="self-stretch bg-[#27AE60] gap-3 my-auto px-4 py-3 rounded-[90px]">
                Create card
              </Button>
            </Link>
            <Link to="/profile">
              <Button className="self-stretch gap-3 my-auto px-4 py-3 rounded-[90px]">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#353945] flex min-h-px w-full" />
    </div>
  );
};
