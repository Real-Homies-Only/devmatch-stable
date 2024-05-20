import React from "react";
import NavBar from "@/app/components/server/NavBar";
import { AuthProvider } from "@/app/context/AuthContext";
import BidForm from "@/app/components/client/ProjectBids";
const Bid = () => {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <BidForm />
      </AuthProvider>
    </div>
  );
};

export default Bid;
