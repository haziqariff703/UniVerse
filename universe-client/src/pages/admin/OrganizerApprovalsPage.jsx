import { useNavigate } from "react-router-dom";
import OrganizerApprovals from "@/components/admin/OrganizerApprovals";

const OrganizerApprovalsPage = () => {
  const navigate = useNavigate();
  return <OrganizerApprovals onBack={() => navigate(-1)} />;
};

export default OrganizerApprovalsPage;
