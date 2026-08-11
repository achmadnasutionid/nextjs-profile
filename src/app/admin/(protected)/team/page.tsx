import { prisma } from "@/lib/prisma";
import { deleteTeamMember } from "../actions";
import { CardListPage } from "@/components/admin/card-list";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const members = await prisma.teamMember.findMany({
    include: { media: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <CardListPage
      title="Our Team"
      basePath="/admin/team"
      addLabel="+ Add team member"
      emptyLabel="No team members yet. Add your first one above."
      items={members.map((m) => ({
        id: m.id,
        nameEn: m.nameEn,
        nameId: m.nameId,
        mediaUrl: m.media?.url,
      }))}
      deleteAction={deleteTeamMember}
      saved={saved}
      deleted={deleted}
    />
  );
}
