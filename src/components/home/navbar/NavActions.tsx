
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CRDButton } from "@/components/ui/design-system";

export const NavActions = () => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-crd-lightGray text-sm">Welcome, {user.email}</span>
        <CRDButton
          onClick={signOut}
          variant="ghost"
          size="sm"
        >
          Sign Out
        </CRDButton>
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
