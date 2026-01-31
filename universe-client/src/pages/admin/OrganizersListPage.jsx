import { useNavigate } from "react-router-dom";
import OrganizersList from "@/components/admin/OrganizersList";

const OrganizersListPage = () => {
  const navigate = useNavigate();
  return <OrganizersList onBack={() => navigate(-1)} />;
};

export default OrganizersListPage;
