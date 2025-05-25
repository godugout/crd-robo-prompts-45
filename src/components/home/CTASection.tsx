
import React from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useCustomAuth } from "@/features/auth/hooks/useCustomAuth";

export const CTASection: React.FC = () => {
  const { user } = useCustomAuth();

  return (
    <div className="bg-crd-darkest flex justify-center items-center py-32 px-5">
      <div className="flex flex-col items-center text-center max-w-3xl">
        <Typography 
          as="h2" 
          variant="h1" 
          className="mb-6 max-w-xl"
        >
          {user ? "Ready to create your next masterpiece?" : "Create your own card collection today"}
        </Typography>
        <Typography 
          variant="body" 
          className="text-crd-lightGray text-lg mb-10 max-w-xl"
        >
          {user 
            ? "Jump back into the editor or explore what other creators are building."
            : "Card art is the easiest way to collect and display your digital assets. Join thousands of collectors from around the world."
          }
        </Typography>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link to="/editor">
                <CRDButton 
                  variant="primary" 
                  size="lg"
                  className="px-6 py-4 rounded-[90px]"
                >
                  Create Card
                </CRDButton>
              </Link>
              <Link to="/cards">
                <CRDButton 
                  variant="secondary" 
                  size="lg"
                  className="px-6 py-4 rounded-[90px]"
                >
                  Browse Cards
                </CRDButton>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth/signup">
                <CRDButton 
                  variant="primary" 
                  size="lg"
                  className="px-6 py-4 rounded-[90px]"
                >
                  Get Started
                </CRDButton>
              </Link>
              <Link to="/cards">
                <CRDButton 
                  variant="secondary" 
                  size="lg"
                  className="px-6 py-4 rounded-[90px]"
                >
                  Discover more
                </CRDButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
