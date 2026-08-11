import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct, deleteProduct } from "../../actions";
import { CardForm } from "@/components/admin/card-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!product) notFound();

  return (
    <CardForm
      title="Edit product"
      backHref="/admin/products"
      nameLabel="Name"
      detailLabel="Detail"
      action={updateProduct.bind(null, id)}
      submitLabel="Save changes"
      initial={{
        nameEn: product.nameEn,
        nameId: product.nameId,
        detailEn: product.detailEn,
        detailId: product.detailId,
        mediaUrl: product.media?.url,
        altTextEn: product.media?.altTextEn,
        altTextId: product.media?.altTextId,
      }}
      deleteAction={deleteProduct}
      deleteId={product.id}
      deleteConfirmMessage={`Delete "${product.nameEn}"? This cannot be undone.`}
    />
  );
}
