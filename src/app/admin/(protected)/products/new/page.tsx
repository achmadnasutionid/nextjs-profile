import { createProduct } from "../../actions";
import { CardForm } from "@/components/admin/card-form";

export default function NewProductPage() {
  return (
    <CardForm
      title="Add product"
      backHref="/admin/products"
      nameLabel="Name"
      detailLabel="Detail"
      action={createProduct}
      submitLabel="Add product"
    />
  );
}
