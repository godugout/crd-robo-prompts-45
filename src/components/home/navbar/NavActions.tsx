
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const NavActions = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm">Welcome back!</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white"
            onClick={() => window.location.href = '/profile'}
          >
            Profile
          </Button>
        </div>
      ) : (
        <Link to="/auth/signin">
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
};
