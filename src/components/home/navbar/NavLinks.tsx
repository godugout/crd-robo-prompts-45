import React from "react";
import { Link, useLocation } from "react-router-dom";

// Gold colors (same as before, but used only for styling now)
const GOLD = "#FFD700";
const GOLD_GRADIENT =
  "linear-gradient(93deg, #FEF7CD 30%, #FFD700 60%, #F97316 100%)";

const ShowroomLink: React.FC<{ active: boolean }> = ({ active }) => {
  // Remove bulb animation and side bulbs

  // Showroom link with subtle gold by default, glowing/shining on hover/active, static gold when selected
  return (
    <span className="relative inline-block px-3">
      <Link
        to="/shop"
        className={
          [
            "relative z-20 inline-block font-extrabold px-5 py-1 rounded text-[1.5rem] leading-none tracking-wide transition-all duration-200",
            active
              ? "text-yellow-300 shadow-[0_0_16px_8px_rgba(255,210,30,0.85)]"
              : "text-[#FFD700] hover:scale-105",
            !active
              ? "hover:shadow-[0_0_18px_6px_rgba(255,210,30,0.6)] hover:bg-[#181105] focus:shadow-[0_0_22px_10px_rgba(255,210,30,0.7)]"
              : "",
            !active
              ? "active:shadow-[0_0_35px_14px_rgba(255,210,30,0.95)]"
              : "",
            active
              ? "bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-400 border border-yellow-200"
              : "",
          ].join(" ")
        }
        style={{
          ...(active
            ? {
                textShadow:
                  "0 0 18px #FFD700, 0 1px 45px #FFF99D, 0 0 8px #FFA500",
                background: GOLD_GRADIENT,
                borderRadius: "0.5em",
              }
            : {
                textShadow: "0 0 12px #FFD700, 0 0 4px #444",
              }),
        }}
      >
        SHOWROOM
        {/* Underline bar: subtle by default, stronger on hover/active, static when selected */}
        {!active && (
          <span className="absolute left-0 bottom-[-9px] w-full h-2 z-30 pointer-events-none select-none">
            <span className="block w-full h-1 rounded bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 opacity-60 transition-opacity duration-200 group-hover:opacity-90 animate-[showroom-bar-shine_2.1s_linear_infinite]" />
          </span>
        )}
        {active && (
          <span className="absolute left-0 bottom-[-9px] w-full h-2 z-30 pointer-events-none select-none">
            <span className="block w-full h-1 rounded bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 opacity-95 shadow-[0_0_16px_3px_rgba(255,175,0,0.28)]" />
          </span>
        )}
      </Link>
      {/* Only need the animated shine for non-active, and static gold bar for active */}
      <style>{`
      @keyframes showroom-bar-shine {
        0% { filter: brightness(0.8) drop-shadow(0 0 2px #FFD700); opacity: 0.85; }
        15% { filter: brightness(1.27) drop-shadow(0 0 12px #FFD700); }
        50% { filter: brightness(0.96) drop-shadow(0 0 7px #F97316); }
        65% { filter: brightness(1.06) drop-shadow(0 0 17px #FFD700); }
        100% { filter: brightness(0.8) drop-shadow(0 0 2px #FFD700); opacity: 0.85; }
      }
      `}</style>
    </span>
  );
};

export const NavLinks = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
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
