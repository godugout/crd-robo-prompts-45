
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const NavActions = () => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-crd-lightGray text-sm">Welcome, {user.email}</span>
        <Button
          onClick={signOut}
          variant="outline"
          className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link to="/auth">
        <Button
          variant="outline"
          className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
        >
          Sign In
        </Button>
      </Link>
    </div>
  );
};
