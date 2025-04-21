
import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// Animated Broadway SHOWROOM component
const bulbColors = [
  "#FFD700", // bright yellow
  "#F97316", // bright orange
  "#8B5CF6", // purple
  "#1EAEDB", // blue
  "#FEF7CD", // warm white
  "#D946EF", // magenta
];

const NUM_BULBS = 14; // 7 left, 7 right

function randomInt(n: number) {
  return Math.floor(Math.random() * n);
}

const ShowroomLink: React.FC<{active: boolean}> = ({active}) => {
  const bulbsRef = useRef<HTMLSpanElement[]>([]);

  // Setup flashing animation for bulbs
  useEffect(() => {
    let frame = 0;
    let raf: number;
    function animate() {
      bulbsRef.current.forEach((el, i) => {
        if (!el) return;
        // Flash at random intervals
        const phase = (frame + i * 5) % 60;
        if (phase < 7) {
          el.style.opacity = String(0.25 + 0.55 * Math.random());
          el.style.filter = `blur(${Math.random() * 1.2}px)`;
        } else if (phase < 10) {
          el.style.opacity = "1";
          el.style.filter = "blur(1px)";
        } else {
          el.style.opacity = "0.7";
          el.style.filter = "blur(0.4px)";
        }
        // Occasionally swap color for "sparkle"
        if (Math.random() > 0.97) {
          el.style.background = bulbColors[randomInt(bulbColors.length)];
        } else if (frame % 33 === 0) {
          el.style.background = bulbColors[(i+i+frame)%bulbColors.length];
        }
      });
      frame++;
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Render bulbs around text & animated underline below
  return (
    <span className="relative inline-block px-3">
      <span className="absolute z-10 top-1/2 left-0 -translate-x-[50%] -translate-y-1/2 flex flex-col gap-0.5">
        {Array(NUM_BULBS/2).fill(0).map((_, i) => (
          <span
            ref={el => bulbsRef.current[i] = el!}
            key={"left-"+i}
            className="block w-[10px] h-[10px] rounded-full shadow-[0_0_8px_2px_rgba(255,235,0,0.8)] transition-all"
            style={{
              background: bulbColors[i % bulbColors.length],
              marginBottom: i !== (NUM_BULBS/2-1) ? "2px" : undefined,
            }}
            aria-hidden
          />
        ))}
      </span>
      <span className="absolute z-10 top-1/2 right-0 translate-x-[50%] -translate-y-1/2 flex flex-col gap-0.5">
        {Array(NUM_BULBS/2).fill(0).map((_, i) => (
          <span
            ref={el => bulbsRef.current[NUM_BULBS/2 + i] = el!}
            key={"right-"+i}
            className="block w-[10px] h-[10px] rounded-full shadow-[0_0_8px_2px_rgba(255,235,0,0.8)] transition-all"
            style={{
              background: bulbColors[(NUM_BULBS/2 + i) % bulbColors.length],
              marginBottom: i !== (NUM_BULBS/2-1) ? "2px" : undefined,
            }}
            aria-hidden
          />
        ))}
      </span>
      <Link 
        to="/shop"
        className={
          "relative z-20 inline-block font-extrabold px-5 py-1 rounded " +
          "text-[1.5rem] leading-none tracking-wide transition-all duration-200 " +
          (active 
            ? "text-yellow-300 shadow-[0_0_16px_8px_rgba(255,210,30,0.85)]"
            : "text-[#FFD700] hover:scale-105 hover:brightness-125"
          )
        }
        style={{
          textShadow: active
            ? "0 0 18px #FFD700, 0 1px 45px #FFF99D, 0 0 8px #FFA500"
            : "0 0 12px #FFD700",
          background: active 
            ? "linear-gradient(93deg, #FEF7CD 30%, #FFD700 60%, #F97316 100%)"
            : "none",
          borderRadius: "0.5em",
        }}
      >
        SHOWROOM
        {/* Animated underline bar using only Tailwind gradient and CSS */}
        <span 
          className="absolute block left-0 bottom-[-9px] w-full h-2 z-30 pointer-events-none"
        >
          <span className="block w-full h-1 rounded bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 opacity-80 animate-[showroom-bar-shine_2.6s_linear_infinite] shadow-[0_0_16px_3px_rgba(255,175,0,0.55)]"></span>
        </span>
      </Link>
      {/* Keyframes and shine animation, scoped to this component */}
      <style>{`
      @keyframes showroom-bar-shine {
        0% { filter: brightness(0.8) drop-shadow(0 0 2px #FFD700); opacity: 0.91; }
        15% { filter: brightness(1.44) drop-shadow(0 0 8px #FFD700); opacity: 1;}
        50% { filter: brightness(1) drop-shadow(0 0 4px #F97316); opacity: 0.95;}
        75% { filter: brightness(1.27) drop-shadow(0 0 18px #FFD700); opacity: 1;}
        100% { filter: brightness(0.8) drop-shadow(0 0 2px #FFD700); opacity: 0.91; }
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
        className={isActive('/cards') ? "underline text-[#EA6E48]" : "font-semibold text-[#BDBDBD] hover:text-[#EA6E48]"}
      >
        CARDS
      </Link>
      <ShowroomLink active={isActive('/shop') || isActive('/decks')} />
      <Link 
        to="/creators" 
        className={isActive('/creators') ? "underline text-[#EA6E48]" : "font-semibold text-[#BDBDBD] hover:text-[#EA6E48]"}
      >
        CREATORS
      </Link>
    </div>
  );
};

