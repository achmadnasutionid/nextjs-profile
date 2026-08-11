import { createTeamMember } from "../../actions";
import { CardForm } from "@/components/admin/card-form";

export default function NewTeamMemberPage() {
  return (
    <CardForm
      title="Add team member"
      backHref="/admin/team"
      nameLabel="Name"
      detailLabel="Role"
      action={createTeamMember}
      submitLabel="Add team member"
    />
  );
}
