
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CRDButton } from "@/components/ui/design-system";
import { ProfileDropdown } from "./ProfileDropdown";

export const NavActions = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <ProfileDropdown />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link to="/auth">
        <CRDButton
          variant="outline"
          size="sm"
        >
          Sign In
        </CRDButton>
      </Link>
    </div>
  );
};
