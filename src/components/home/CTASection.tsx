
import React from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";

export const CTASection: React.FC = () => {
  return (
    <div className="bg-crd-darkest flex justify-center items-center py-32 px-5">
      <div className="flex flex-col items-center text-center max-w-3xl">
        <Typography 
          as="h2" 
          variant="h1" 
          className="mb-6 max-w-xl"
        >
          Create your own card collection today
        </Typography>
        <Typography 
          variant="body" 
          className="text-crd-lightGray text-lg mb-10 max-w-xl"
        >
          Card art is the easiest way to collect and display your digital assets. Join thousands of collectors from around the world.
        </Typography>
        <div className="flex gap-4">
          <Link to="/editor">
            <CRDButton 
              variant="primary" 
              size="lg"
              className="px-6 py-4 rounded-[90px]"
            >
              Create Card
            </CRDButton>
          </Link>
          <Link to="/feed">
            <CRDButton 
              variant="secondary" 
              size="lg"
              className="px-6 py-4 rounded-[90px]"
            >
              Discover more
            </CRDButton>
          </Link>
        </div>
      </div>
    </div>
  );
};
