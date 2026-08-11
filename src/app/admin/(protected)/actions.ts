"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage, uploadFile } from "@/lib/cloudinary";

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function updateSection(key: string, formData: FormData) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const titleEn = String(formData.get("titleEn") ?? "");
  const titleId = String(formData.get("titleId") ?? "");
  const bodyEn = String(formData.get("bodyEn") ?? "");
  const bodyId = String(formData.get("bodyId") ?? "");
  const altTextEn = String(formData.get("altTextEn") ?? "");
  const altTextId = String(formData.get("altTextId") ?? "");
  const file = formData.get("image");

  let mediaId: string | undefined;

  if (file instanceof File && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadImage(buffer, "bona-nauli-perkasa");
    const media = await prisma.media.create({
      data: {
        publicId: uploaded.publicId,
        url: uploaded.url,
        altTextEn,
        altTextId,
      },
    });
    mediaId = media.id;
  }

  const existingSection = await prisma.pageSection.findUnique({ where: { key } });
  if (!mediaId && existingSection?.mediaId) {
    await prisma.media.update({
      where: { id: existingSection.mediaId },
      data: { altTextEn, altTextId },
    });
  }

  const contactFields =
    formData.has("whatsappNumber") ||
    formData.has("googleMapsUrl") ||
    formData.has("contactEmail")
      ? {
          whatsappNumber: String(formData.get("whatsappNumber") ?? "") || null,
          googleMapsUrl: String(formData.get("googleMapsUrl") ?? "") || null,
          contactEmail: String(formData.get("contactEmail") ?? "") || null,
        }
      : {};

  let fileFields: Record<string, unknown> = {};
  const docFile = formData.get("file");
  if (docFile instanceof File && docFile.size > 0) {
    const buffer = Buffer.from(await docFile.arrayBuffer());
    const uploaded = await uploadFile(buffer, "bona-nauli-perkasa/documents", docFile.name);
    fileFields = {
      fileUrl: uploaded.url,
      filePublicId: uploaded.publicId,
      fileName: String(formData.get("fileName") ?? "") || null,
    };
  } else if (formData.has("fileName")) {
    fileFields = { fileName: String(formData.get("fileName") ?? "") || null };
  }

  await prisma.pageSection.update({
    where: { key },
    data: {
      titleEn,
      titleId,
      bodyEn,
      bodyId,
      ...(mediaId ? { mediaId } : {}),
      ...contactFields,
      ...fileFields,
    },
  });

  revalidatePath("/en");
  revalidatePath("/id");
  redirect(`/admin?saved=${key}`);
}

// Shared CRUD for the "card" content types (Product, TeamMember) — same
// shape (name/detail/image/order) in both Prisma models.
type CardRecord = { id: string; mediaId: string | null; order: number };
type CardDelegate = {
  findFirst(args: { orderBy: { order: "desc" } }): Promise<CardRecord | null>;
  findUnique(args: { where: { id: string } }): Promise<CardRecord | null>;
  create(args: { data: Record<string, unknown> }): Promise<CardRecord>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<CardRecord>;
  delete(args: { where: { id: string } }): Promise<CardRecord>;
};

async function uploadCardImage(formData: FormData, folder: string) {
  const altTextEn = String(formData.get("altTextEn") ?? "");
  const altTextId = String(formData.get("altTextId") ?? "");
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) return undefined;

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadImage(buffer, folder);
  const media = await prisma.media.create({
    data: { publicId: uploaded.publicId, url: uploaded.url, altTextEn, altTextId },
  });
  return media.id;
}

async function createCard(
  delegate: CardDelegate,
  folder: string,
  redirectPath: string,
  formData: FormData,
) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const nameEn = String(formData.get("nameEn") ?? "");
  const nameId = String(formData.get("nameId") ?? "");
  const detailEn = String(formData.get("detailEn") ?? "");
  const detailId = String(formData.get("detailId") ?? "");
  const mediaId = await uploadCardImage(formData, folder);

  const last = await delegate.findFirst({ orderBy: { order: "desc" } });

  await delegate.create({
    data: { nameEn, nameId, detailEn, detailId, mediaId, order: (last?.order ?? -1) + 1 },
  });

  revalidatePath("/en");
  revalidatePath("/id");
  redirect(`${redirectPath}?saved=1`);
}

async function updateCard(
  delegate: CardDelegate,
  folder: string,
  redirectPath: string,
  id: string,
  formData: FormData,
) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const nameEn = String(formData.get("nameEn") ?? "");
  const nameId = String(formData.get("nameId") ?? "");
  const detailEn = String(formData.get("detailEn") ?? "");
  const detailId = String(formData.get("detailId") ?? "");
  const mediaId = await uploadCardImage(formData, folder);

  if (!mediaId) {
    const existing = await delegate.findUnique({ where: { id } });
    if (existing?.mediaId) {
      await prisma.media.update({
        where: { id: existing.mediaId },
        data: {
          altTextEn: String(formData.get("altTextEn") ?? ""),
          altTextId: String(formData.get("altTextId") ?? ""),
        },
      });
    }
  }

  await delegate.update({
    where: { id },
    data: { nameEn, nameId, detailEn, detailId, ...(mediaId ? { mediaId } : {}) },
  });

  revalidatePath("/en");
  revalidatePath("/id");
  redirect(`${redirectPath}?saved=1`);
}

async function deleteCard(delegate: CardDelegate, redirectPath: string, formData: FormData) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  await delegate.delete({ where: { id } });

  revalidatePath("/en");
  revalidatePath("/id");
  redirect(`${redirectPath}?deleted=1`);
}

export async function createProduct(formData: FormData) {
  return createCard(prisma.product, "bona-nauli-perkasa/products", "/admin/products", formData);
}
export async function updateProduct(id: string, formData: FormData) {
  return updateCard(prisma.product, "bona-nauli-perkasa/products", "/admin/products", id, formData);
}
export async function deleteProduct(formData: FormData) {
  return deleteCard(prisma.product, "/admin/products", formData);
}

export async function createTeamMember(formData: FormData) {
  return createCard(prisma.teamMember, "bona-nauli-perkasa/team", "/admin/team", formData);
}
export async function updateTeamMember(id: string, formData: FormData) {
  return updateCard(prisma.teamMember, "bona-nauli-perkasa/team", "/admin/team", id, formData);
}
export async function deleteTeamMember(formData: FormData) {
  return deleteCard(prisma.teamMember, "/admin/team", formData);
}
