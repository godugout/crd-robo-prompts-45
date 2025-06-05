
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CRDButton } from "@/components/ui/design-system";

export const NavActions = () => {
  const { user, signOut, isDevelopment } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-crd-lightGray text-sm">
          Welcome, {user.email}
          {isDevelopment && <span className="ml-1 text-xs text-yellow-400">(DEV)</span>}
        </span>
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
      <Link to="/auth/signin">
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
