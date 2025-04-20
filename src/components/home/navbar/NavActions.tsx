
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NavActions = () => {
  return (
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
  );
};
