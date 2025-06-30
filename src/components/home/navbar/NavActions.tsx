
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { CRDButton } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { Menu } from "lucide-react";

export const NavActions = () => {
  const { user } = useAuth();
  const { setNavigationStyle } = useNavigation();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setNavigationStyle('sidebar')}
        className="text-crd-lightGray hover:text-white p-2"
        title="Switch to sidebar navigation"
      >
        <Menu className="w-4 h-4" />
      </Button>
      
      {user ? (
        <ProfileDropdown />
      ) : (
        <Link to="/auth/signin">
          <CRDButton
            variant="outline"
            size="sm"
          >
            Sign In
          </CRDButton>
        </Link>
      )}
    </div>
  );
};
