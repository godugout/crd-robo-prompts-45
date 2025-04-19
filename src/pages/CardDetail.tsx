import React from "react";

export default function CardDetail() {
  return (
    <div className="bg-[#141416] min-h-screen text-[#FCFCFD] font-poppins">
      <div className="flex w-full items-center justify-between px-8 py-12 md:px-32 md:py-12">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c644015ec0ce7f9366b7df84be178b8bcf46b37"
            alt="Logo"
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

      <div className="flex flex-col md:flex-row gap-16 px-4 py-16 md:px-32">
        <div className="relative w-full md:w-[311px] h-[420px] bg-[#353945] rounded-2xl">
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
            className="absolute w-full h-[553px] -top-[67px]"
          />
          <div className="absolute bottom-8 left-[52px] flex gap-6">
            <button className="p-3 rounded-full border-2 border-[#353945]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.99858 10.0399C9.02798 10.5914 8.60474 11.0623 8.05324 11.0917C7.30055 11.1318 6.7044 11.1809 6.23854 11.23C5.61292 11.296 5.23278 11.6803 5.16959 12.2331C5.07886 13.0267 5 14.2278 5 16C5 17.7723 5.07886 18.9733 5.16959 19.7669C5.23289 20.3207 5.61207 20.7039 6.23675 20.7698C7.33078 20.8853 9.13925 21 12 21C14.8608 21 16.6692 20.8853 17.7632 20.7698C18.3879 20.7039 18.7671 20.3207 18.8304 19.7669C18.9211 18.9733 19 17.7723 19 16C19 14.2278 18.9211 13.0267 18.8304 12.2331C18.7672 11.6803 18.3871 11.296 17.7615 11.23C17.2956 11.1809 16.6995 11.1318 15.9468 11.0917C15.3953 11.0623 14.972 10.5914 15.0014 10.0399C15.0308 9.48837 15.5017 9.06512 16.0532 9.09452C16.8361 9.13626 17.4669 9.18787 17.9712 9.24106C19.4556 9.39761 20.6397 10.4507 20.8175 12.0059C20.9188 12.8923 21 14.1715 21 16C21 17.8285 20.9188 19.1077 20.8175 19.9941C20.6398 21.5484 19.4585 22.602 17.9732 22.7588C16.7919 22.8834 14.9108 23 12 23C9.08922 23 7.20806 22.8834 6.02684 22.7588C4.54151 22.602 3.36021 21.5484 3.18253 19.9941C3.0812 19.1077 3 17.8285 3 16C3 14.1715 3.0812 12.8923 3.18253 12.0059C3.36031 10.4507 4.54436 9.39761 6.02877 9.24106C6.53306 9.18787 7.16393 9.13626 7.94676 9.09452C8.49827 9.06512 8.96918 9.48837 8.99858 10.0399Z" fill="#777E91"/>
              </svg>
            </button>
            <button className="p-3 rounded-full border-2 border-[#353945]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4.80957C10.8321 3.6888 9.24649 3 7.5 3C3.91015 3 1 5.91015 1 9.5C1 15.8683 7.97034 19.385 10.8138 20.5547C11.5796 20.8697 12.4204 20.8697 13.1862 20.5547C16.0297 19.385 23 15.8682 23 9.5C23 5.91015 20.0899 3 16.5 3C14.7535 3 13.1679 3.6888 12 4.80957Z" fill="#EF466F"/>
              </svg>
            </button>
            <button className="p-3 rounded-full border-2 border-[#353945]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="#777E91"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-16">
          <div className="space-y-10">
            <h1 className="font-raleway text-4xl font-black">The amazing art</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-1 text-lg font-raleway font-extrabold border-2 border-[#45B26B] text-[#45B26B] rounded">
                2.5 ETH
              </span>
              <span className="px-2 py-1 text-lg font-raleway font-extrabold border-2 border-[#353945] text-[#777E90] rounded">
                $4,429.87
              </span>
              <span className="text-lg font-raleway font-extrabold text-[#777E90]">
                10 in stock
              </span>
            </div>
          </div>

          <p className="text-[#777E90]">
            This NFT Card will give you Access to Special Airdrops. To learn more about UI8 please visit{" "}
            <a href="https://ui8.net" className="text-[#FCFCFD] underline">
              https://ui8.net
            </a>
          </p>

          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-2 w-full px-2 py-2 border-2 border-[#353945] rounded-full">
              <span className="px-3 py-1 bg-[#E6E8EC] text-[#23262F] font-raleway font-extrabold rounded-full">
                Info
              </span>
              <span className="px-3 py-1 font-raleway font-extrabold text-[#777E90] rounded-full">
                Owners
              </span>
              <span className="px-3 py-1 font-raleway font-extrabold text-[#777E90] rounded-full">
                History
              </span>
              <span className="px-3 py-1 font-raleway font-extrabold text-[#777E90] rounded-full">
                Bids
              </span>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#45B26B] relative">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/77ee634857aa609f375324cdc5e1ff1ca2c4f60"
                    alt="Owner Avatar"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-poppins text-[#777E90]">
                    Owner
                  </span>
                  <span className="text-sm font-poppins text-white">
                    Raquel Will
                  </span>
                </div>
              </div>
              <hr className="border-t border-[#353945]" />
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#45B26B] relative">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d51e97c03168fc86320c5b5288785196fd658cf"
                    alt="Creator Avatar"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-poppins text-[#777E90]">
                    Creator
                  </span>
                  <span className="text-sm font-poppins text-white">
                    Selina Mayert
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 px-4 py-4 border border-[#353945] bg-[#23262F] rounded-2xl shadow-[0px_64px_64px_-48px_rgba(31,47,70,0.12)]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-raleway font-semibold text-[#777E90]">
                  Highest bid by
                </span>
                <span className="text-sm font-raleway font-semibold text-white">
                  Kohaku Tora
                </span>
                <span className="text-xl font-raleway font-bold text-white">
                  1.46 ETH
                </span>
                <span className="text-xl font-raleway font-bold text-[#777E90]">
                  $2,764.89
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#45B26B] relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d51e97c03168fc86320c5b5288785196fd658cf"
                  alt="Bidder Avatar"
                  className="w-12 h-[72px] absolute -top-1 left-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex-1 px-5 py-4 text-lg font-raleway font-extrabold text-white text-center bg-[#3772FF] rounded-[90px]">
                Purchase now
              </span>
              <span className="flex-1 px-5 py-4 text-lg font-raleway font-extrabold text-white text-center border-2 border-[#353945] rounded-[90px]">
                Place a bid
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-poppins text-[#777E90]">
                Service fee
              </span>
              <span className="text-sm font-poppins text-white">1.5%</span>
              <span className="text-sm font-poppins text-[#777E90]">
                2.563 ETH
              </span>
              <span className="text-sm font-poppins text-[#777E90]">
                $4,540.62
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
