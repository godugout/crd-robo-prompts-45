
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Golds for styling
const GOLD = "#FFD700";
const GOLD_GRADIENT =
  "linear-gradient(93deg, #FEF7CD 30%, #FFD700 60%, #F97316 100%)";

const ShowroomLink: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <span className="relative inline-block px-3 group">
      <Link
        to="/shop"
        className={
          [
            "relative z-20 inline-block font-extrabold px-5 py-1 rounded text-[1.5rem] leading-none tracking-wide transition-all duration-200",
            active
              ? "text-yellow-300 shadow-[0_0_16px_8px_rgba(255,210,30,0.85)]"
              : "text-[#FFD700] hover:scale-105",
            !active
              ? "hover:shadow-[0_0_18px_8px_rgba(255,210,30,0.8)] focus:shadow-[0_0_22px_10px_rgba(255,210,30,0.7)]"
              : "",
            !active
              ? "active:shadow-[0_0_30px_12px_rgba(255,210,30,1)]"
              : "",
            active
              ? "bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-400 border border-yellow-200"
              : "",
            "overflow-hidden",
          ].join(" ")
        }
        style={{
          ...(active
            ? {
                color: "#FFD700",
                textShadow:
                  "0 1px 18px #FFD700, 0 1px 36px #FFF99D, 0 0 6px #FFA500",
              }
            : {
                textShadow: "0 0 7px #FFD700, 0 0 3px #444",
              }),
        }}
      >
        <span className="relative">
          <span
            className={
              !active
                ? "inline-block showroom-shine group-hover:animate-showroom-shine pointer-events-none"
                : ""
            }
            style={
              !active
                ? {
                    background:
                      "linear-gradient(90deg,rgba(255,255,200,0) 0%,rgba(255,255,220,0.8) 45%,rgba(255,255,200,0) 60%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    // fallback for browsers that support only one
                    backgroundClip: "text",
                    color: "inherit",
                  }
                : {}
            }
          >
            SHOWROOM
          </span>
        </span>
        {/* Underline bar: subtle default, glowy on hover, static if selected */}
        <span className="absolute left-0 bottom-[-8px] w-full h-2 z-30 pointer-events-none select-none">
          <span className={[
            "block w-full h-1 rounded",
            active
              ? "bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 opacity-100 shadow-[0_0_18px_5px_rgba(255,200,40,0.38)]"
              : "bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-300 opacity-55 group-hover:opacity-95 transition-opacity duration-200"
          ].join(" ")} />
        </span>
      </Link>
      <style>{`
      @keyframes showroom-shine {
        0% { filter: brightness(0.88); }
        12% { filter: brightness(1.35) drop-shadow(0 0 22px #FFF7C0); }
        26% { filter: brightness(1.07); }
        33% { filter: brightness(1.09) drop-shadow(0 0 14px #FFD700); }
        52% { filter: brightness(1.23) drop-shadow(0 0 25px #FFD700); }
        80% { filter: brightness(0.94); }
        100% { filter: brightness(0.88); }
      }
      .showroom-shine {
        background-size: 300% 300%;
        background-position: left;
      }
      .group-hover\\:animate-showroom-shine:hover, .group-hover\\:animate-showroom-shine:focus {
        animation: showroom-shine 1.8s both;
      }
      `}
      </style>
    </span>
  );
};

export const NavLinks = () => {
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path;
  return (
    <div className="text-[#b1b5c3] text-center text-sm font-extrabold leading-none self-stretch my-auto flex gap-2 items-center">
      <Link
        to="/cards"
        className={
          isActive("/cards")
            ? "underline text-[#EA6E48]"
            : "font-semibold text-[#BDBDBD] hover:text-[#EA6E48]"
        }
      >
        CARDS
      </Link>
      <ShowroomLink active={isActive("/shop") || isActive("/decks")} />
      <Link
        to="/creators"
        className={
          isActive("/creators")
            ? "underline text-[#EA6E48]"
            : "font-semibold text-[#BDBDBD] hover:text-[#EA6E48]"
        }
      >
        CREATORS
      </Link>
    </div>
  );
};
