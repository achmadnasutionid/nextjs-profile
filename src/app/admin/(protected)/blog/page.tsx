import { prisma } from "@/lib/prisma";
import { deletePost } from "./actions";
import { CardListPage } from "@/components/admin/card-list";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const posts = await prisma.blogPost.findMany({
    include: { coverMedia: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <CardListPage
      title="News Articles"
      basePath="/admin/blog"
      addLabel="+ Add article"
      emptyLabel="No articles yet. Add your first one above."
      items={posts.map((post) => ({
        id: post.id,
        nameEn: post.status === "DRAFT" ? `[Draft] ${post.titleEn}` : post.titleEn,
        nameId: post.titleId,
        mediaUrl: post.coverMedia?.url,
      }))}
      deleteAction={deletePost}
      saved={saved}
      deleted={deleted}
    />
  );
}
