import { prisma } from "@/lib/prisma";
import { deleteProduct } from "../actions";
import { CardListPage } from "@/components/admin/card-list";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const products = await prisma.product.findMany({
    include: { media: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <CardListPage
      title="Products"
      basePath="/admin/products"
      addLabel="+ Add product"
      emptyLabel="No products yet. Add your first one above."
      items={products.map((p) => ({
        id: p.id,
        nameEn: p.nameEn,
        nameId: p.nameId,
        mediaUrl: p.media?.url,
      }))}
      deleteAction={deleteProduct}
      saved={saved}
      deleted={deleted}
    />
  );
}
