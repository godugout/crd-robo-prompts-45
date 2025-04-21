
import React from "react";
import { CardActionButton } from "./buttons/CardActionButton";

// 2.5in x 3.5in = 216 x 302px at 96dpi (browser default 1in = 96px)
const CARD_WIDTH = 240; // slightly larger to work well visually on screen
const CARD_HEIGHT = 336;

export const CardPreview = () => {
  return (
    <div className="relative bg-[#353945] rounded-2xl" style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
      <div className="absolute top-6 left-6 flex gap-2">
        <span className="px-2 py-2 text-xs font-raleway font-semibold uppercase bg-white text-[#23262F] rounded">
          Art
        </span>
        <span className="px-2 py-2 text-xs font-raleway font-semibold uppercase bg-[#9757D7] text-white rounded">
          Unlockable
        </span>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3fccaef4a8c8a85ab1b25e96634ffea6707d7f"
        alt="Card Art"
        className="absolute w-full h-full object-cover"
        style={{ borderRadius: "1rem" }}
      />
      <div className="absolute bottom-8 left-[40px] flex gap-6">
        <CardActionButton
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.99858 10.0399C9.02798 10.5914 8.60474 11.0623 8.05324 11.0917C7.30055 11.1318 6.7044 11.1809 6.23854 11.23C5.61292 11.296 5.23278 11.6803 5.16959 12.2331C5.07886 13.0267 5 14.2278 5 16C5 17.7723 5.07886 18.9733 5.16959 19.7669C5.23289 20.3207 5.61207 20.7039 6.23675 20.7698C7.33078 20.8853 9.13925 21 12 21C14.8608 21 16.6692 20.8853 17.7632 20.7698C18.3879 20.7039 18.7671 20.3207 18.8304 19.7669C18.9211 18.9733 19 17.7723 19 16C19 14.2278 18.9211 13.0267 18.8304 12.2331C18.7672 11.6803 18.3871 11.296 17.7615 11.23C17.2956 11.1809 16.6995 11.1318 15.9468 11.0917C15.3953 11.0623 14.972 10.5914 15.0014 10.0399C15.0308 9.48837 15.5017 9.06512 16.0532 9.09452C16.8361 9.13626 17.4669 9.18787 17.9712 9.24106C19.4556 9.39761 20.6397 10.4507 20.8175 12.0059C20.9188 12.8923 21 14.1715 21 16C21 17.8285 20.9188 19.1077 20.8175 19.9941C20.6398 21.5484 19.4585 22.602 17.9732 22.7588C16.7919 22.8834 14.9108 23 12 23C9.08922 23 7.20806 22.8834 6.02684 22.7588C4.54151 22.602 3.36021 21.5484 3.18253 19.9941C3.0812 19.1077 3 17.8285 3 16C3 14.1715 3.0812 12.8923 3.18253 12.0059C3.36031 10.4507 4.54436 9.39761 6.02877 9.24106C6.53306 9.18787 7.16393 9.13626 7.94676 9.09452C8.49827 9.06512 8.96918 9.48837 8.99858 10.0399Z"
                fill="#777E91"
              />
            </svg>
          }
        />
        <CardActionButton
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4.80957C10.8321 3.6888 9.24649 3 7.5 3C3.91015 3 1 5.91015 1 9.5C1 15.8683 7.97034 19.385 10.8138 20.5547C11.5796 20.8697 12.4204 20.8697 13.1862 20.5547C16.0297 19.385 23 15.8682 23 9.5C23 5.91015 20.0899 3 16.5 3C14.7535 3 13.1679 3.6888 12 4.80957Z"
                fill="#EF466F"
              />
            </svg>
          }
        />
        <CardActionButton
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                fill="#777E91"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
};
