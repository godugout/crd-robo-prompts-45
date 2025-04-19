
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141416] w-full py-16 px-[352px] max-md:px-5">
      <div className="flex flex-wrap justify-between gap-12 mb-12">
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="flex gap-2 text-lg text-[#F4F5F6] font-black tracking-[-0.36px] leading-8">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/c58b524115847cb6bae550e7e8d188319790873e?placeholderIfAbsent=true"
              className="aspect-[1.34] object-contain w-[43px]"
              alt="Logo"
            />
            <div>CARDSHOW</div>
          </div>
          <div className="text-[#777E90] text-base">
            The first digital card marketplace for collectors and creators.
          </div>
          <div className="flex gap-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/ead2b833ecbb0d5e802c8121d38ad6f6fbd9caf6?placeholderIfAbsent=true"
              className="w-8 h-8"
              alt="Twitter"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/ebfc99b3e51af13b7b3acbcd4b0c344ed0a5c3f4?placeholderIfAbsent=true"
              className="w-8 h-8"
              alt="Instagram"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/8e7d98f4b2a4ce7c20d4b886499ed0aa22d39276?placeholderIfAbsent=true"
              className="w-8 h-8"
              alt="Facebook"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="text-[#FCFCFD] text-base font-semibold mb-2">CardShow</div>
          <div className="text-[#777E90] flex flex-col gap-3">
            <a href="#" className="hover:text-[#FCFCFD]">Explore</a>
            <a href="#" className="hover:text-[#FCFCFD]">How it works</a>
            <a href="#" className="hover:text-[#FCFCFD]">Create</a>
            <a href="#" className="hover:text-[#FCFCFD]">Support</a>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="text-[#FCFCFD] text-base font-semibold mb-2">Community</div>
          <div className="text-[#777E90] flex flex-col gap-3">
            <a href="#" className="hover:text-[#FCFCFD]">Discord</a>
            <a href="#" className="hover:text-[#FCFCFD]">Twitter</a>
            <a href="#" className="hover:text-[#FCFCFD]">Instagram</a>
            <a href="#" className="hover:text-[#FCFCFD]">Blog</a>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-w-sm">
          <div className="text-[#FCFCFD] text-base font-semibold mb-2">Join Newsletter</div>
          <div className="text-[#777E90] text-base">
            Subscribe to our newsletter to get the latest updates direct to your inbox.
          </div>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-[#23262F] text-[#777E90] px-4 py-3 rounded-l-lg w-64 border-none focus:outline-none" 
            />
            <button className="bg-[#EA6E48] text-white font-bold px-4 py-3 rounded-r-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-[#353945] h-px w-full my-8" />
      
      <div className="flex justify-between text-[#777E90] text-sm flex-wrap gap-4">
        <div>Copyright © 2025 CardShow. All rights reserved</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#FCFCFD]">Terms of Service</a>
          <a href="#" className="hover:text-[#FCFCFD]">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};
