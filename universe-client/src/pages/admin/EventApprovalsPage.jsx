import React from "react";
import EventApprovals from "@/components/admin/EventApprovals";

const EventApprovalsPage = () => {
  return (
    <div className="w-full">
      <EventApprovals onBack={() => window.history.back()} />
    </div>
  );
};

export default EventApprovalsPage;
