
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CTASection: React.FC = () => {
  return (
    <div className="bg-[#141416] flex justify-center items-center py-32 px-5">
      <div className="flex flex-col items-center text-center max-w-3xl">
        <div className="text-[#FCFCFD] text-4xl font-extrabold tracking-tight mb-6">
          Create your own card collection today
        </div>
        <div className="text-[#777E90] text-lg mb-10 max-w-xl">
          Card art is the easiest way to collect and display your digital assets. Join thousands of collectors from around the world.
        </div>
        <div className="flex gap-4">
          <Link to="/editor">
            <Button className="bg-[#EA6E48] text-[#FCFCFD] font-extrabold text-lg px-6 py-4 rounded-[90px]">
              Create Card
            </Button>
          </Link>
          <Link to="/feed">
            <Button className="border-2 border-[#353945] text-[#FCFCFD] font-extrabold text-lg px-6 py-4 rounded-[90px]">
              Discover more
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
