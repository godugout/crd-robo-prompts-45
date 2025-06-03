
import React from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useCustomAuth } from "@/features/auth/hooks/useCustomAuth";
import { useCards } from "@/hooks/useCards";

export const SimplifiedCTA: React.FC = () => {
  const { user } = useCustomAuth();
  const { cards } = useCards();

  // Mock stats for now - these would come from real data
  const stats = {
    creators: "1,200+",
    cardsCreated: cards?.length || "5,400+",
    communities: "50+"
  };

  return (
    <div className="bg-gradient-to-br from-crd-darkest via-purple-900/20 to-blue-900/20 flex justify-center items-center py-32 px-5">
      <div className="flex flex-col items-center text-center max-w-4xl">
        {/* Community Stats */}
        <div className="grid grid-cols-3 gap-8 mb-12 w-full max-w-2xl">
          <div className="text-center">
            <Typography variant="h2" className="text-crd-green mb-2">
              {stats.creators}
            </Typography>
            <Typography variant="body" className="text-crd-lightGray">
              Active Creators
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h2" className="text-crd-blue mb-2">
              {stats.cardsCreated}
            </Typography>
            <Typography variant="body" className="text-crd-lightGray">
              Cards Created
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h2" className="text-crd-orange mb-2">
              {stats.communities}
            </Typography>
            <Typography variant="body" className="text-crd-lightGray">
              Communities
            </Typography>
          </div>
        </div>

        {/* Main CTA Content */}
        <Typography 
          as="h2" 
          variant="h1" 
          className="mb-6 max-w-3xl"
        >
          {user ? "Ready to create your next masterpiece?" : "Join the future of digital card art"}
        </Typography>
        <Typography 
          variant="body" 
          className="text-crd-lightGray text-lg mb-10 max-w-2xl"
        >
          {user 
            ? "Experience the most advanced card creation tools with stunning 3D effects, professional lighting, and high-quality exports."
            : "Create stunning card art with professional 3D effects, advanced lighting systems, and export to high-quality formats. Join thousands of creators worldwide."
          }
        </Typography>

        {/* Action Buttons */}
        <div className="flex gap-6 flex-wrap justify-center">
          {user ? (
            <>
              <Link to="/editor">
                <CRDButton 
                  variant="primary" 
                  size="lg"
                  className="px-8 py-4 rounded-[90px]"
                >
                  Create New Card
                </CRDButton>
              </Link>
              <Link to="/editor">
                <CRDButton 
                  variant="secondary" 
                  size="lg"
                  className="px-8 py-4 rounded-[90px]"
                >
                  View My Cards
                </CRDButton>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth/signup">
                <CRDButton 
                  variant="primary" 
                  size="lg"
                  className="px-8 py-4 rounded-[90px]"
                >
                  Get Started Free
                </CRDButton>
              </Link>
              <Link to="/editor">
                <CRDButton 
                  variant="secondary" 
                  size="lg"
                  className="px-8 py-4 rounded-[90px]"
                >
                  Explore Gallery
                </CRDButton>
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-crd-dark/50 p-6 rounded-xl border border-crd-mediumGray">
            <Typography variant="h3" className="text-crd-green mb-3">
              3D Effects
            </Typography>
            <Typography variant="body" className="text-crd-lightGray text-sm">
              Professional lighting, holographic effects, and immersive viewing experiences
            </Typography>
          </div>
          <div className="bg-crd-dark/50 p-6 rounded-xl border border-crd-mediumGray">
            <Typography variant="h3" className="text-crd-blue mb-3">
              Export Quality
            </Typography>
            <Typography variant="body" className="text-crd-lightGray text-sm">
              High-resolution PNG/JPG and animated GIF exports for print and digital use
            </Typography>
          </div>
          <div className="bg-crd-dark/50 p-6 rounded-xl border border-crd-mediumGray">
            <Typography variant="h3" className="text-crd-orange mb-3">
              Easy Creation
            </Typography>
            <Typography variant="body" className="text-crd-lightGray text-sm">
              Intuitive tools and templates to bring your creative vision to life
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
