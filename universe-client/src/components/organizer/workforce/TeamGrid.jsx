import React from "react";
import {
  MapPin,
  MoreHorizontal,
  Clock,
  Calendar,
  User,
  Shield,
  Briefcase,
  Edit2,
} from "lucide-react";
import { useState } from "react";

import MemberEditDialog from "./MemberEditDialog";

import ModernProfileCard from "./ModernProfileCard";

const TeamGrid = ({ crew, onUpdate, isOwner = false }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {crew.map((member) => (
          <div key={member._id} className="flex justify-center">
            <ModernProfileCard
              member={member}
              isOwner={isOwner}
              onEdit={() => handleEditClick(member)}
            />
          </div>
        ))}
      </div>

      {isOwner && (
        <MemberEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          member={selectedMember}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default TeamGrid;
