import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTeamMember, deleteTeamMember } from "../../actions";
import { CardForm } from "@/components/admin/card-form";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!member) notFound();

  return (
    <CardForm
      title="Edit team member"
      backHref="/admin/team"
      nameLabel="Name"
      detailLabel="Role"
      action={updateTeamMember.bind(null, id)}
      submitLabel="Save changes"
      initial={{
        nameEn: member.nameEn,
        nameId: member.nameId,
        detailEn: member.detailEn,
        detailId: member.detailId,
        mediaUrl: member.media?.url,
        altTextEn: member.media?.altTextEn,
        altTextId: member.media?.altTextId,
      }}
      deleteAction={deleteTeamMember}
      deleteId={member.id}
      deleteConfirmMessage={`Delete "${member.nameEn}"? This cannot be undone.`}
    />
  );
}
