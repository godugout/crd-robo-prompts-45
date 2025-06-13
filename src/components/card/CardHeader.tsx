import React from "react";
import { Link } from "react-router-dom";

export const CardHeader = () => {
  return (
    <div className="flex w-full items-center justify-between px-8 py-12 md:px-32 md:py-12">
      <div className="flex items-center gap-2">
        <img
          src="/lovable-uploads/4b5f3591-e7ce-4903-ba12-be85faf3d44d.png"
          alt="Cardshow Logo"
          className="w-[43px] h-8"
        />
        <span className="font-orbitron text-lg font-black text-[#F4F5F6]">
          CARDSHOW
        </span>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative w-10 h-10">
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#45B26B] rounded-full" />
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-2 left-2"
          >
            <path
              d="M21 18.0233C21 18.5113 20.6043 18.907 20.1163 18.907H3.88372C3.39565 18.907 3 18.5113 3 18.0233C3 17.5352 3.39566 17.1395 3.88372 17.1395H3.9V10.9809C3.9 6.57288 7.527 3 12 3C16.473 3 20.1 6.57288 20.1 10.9809V17.1395H20.1163C20.6043 17.1395 21 17.5352 21 18.0233Z"
              fill="#777E91"
            />
          </svg>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#45B26B] relative">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ef08b78402d8e2b895007bd2da7a1f4b99d053f"
            alt="Avatar"
            className="w-8 h-12 absolute -top-1 left-[60px]"
          />
        </div>
        <button className="md:hidden">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66732 10.6667C5.93094 10.6667 5.33398 11.2636 5.33398 12C5.33398 12.7364 5.93094 13.3333 6.66732 13.3333H25.334C26.0704 13.3333 26.6673 12.7364 26.6673 12C26.6673 11.2636 26.0704 10.6667 25.334 10.6667H6.66732Z"
              fill="#777E91"
            />
            <path
              d="M6.66732 18.6667C5.93094 18.6667 5.33398 19.2636 5.33398 20C5.33398 20.7364 5.93094 21.3333 6.66732 21.3333H25.334C26.0704 21.3333 26.6673 20.7364 26.6673 20C26.6673 19.2636 26.0704 18.6667 25.334 18.6667H6.66732Z"
              fill="#777E91"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
