import React from "react";
import { useNavigate } from "react-router-dom";
import VenueManager from "@/components/admin/VenueManager";

const VenuesPage = () => {
  const navigate = useNavigate();
  return <VenueManager onBack={() => navigate("/admin/dashboard")} />;
};

export default VenuesPage;

