
import React from "react";
import { Link } from "react-router-dom";

export const NavLinks = () => {
  return (
    <div className="text-[#b1b5c3] text-center text-sm font-extrabold leading-none self-stretch my-auto">
      <Link to="/feed" className="underline text-[#EA6E48]">CARDS</Link>{" "}
      <Link to="/decks" className="font-semibold text-[#BDBDBD] hover:text-[#EA6E48]">MARKET</Link>{" "}
      <Link to="/collections" className="font-semibold text-[#BDBDBD] hover:text-[#EA6E48]">COLLECTIONS</Link>{" "}
      <Link to="/templates" className="font-semibold text-[#BDBDBD] hover:text-[#EA6E48]">SHOPS</Link>
    </div>
  );
};
