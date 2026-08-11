"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base: string) {
  let slug = base;
  let n = 2;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${base}-${n}`;
    n++;
  }
  return slug;
}

async function uploadCover(formData: FormData) {
  const altTextEn = String(formData.get("altTextEn") ?? "");
  const altTextId = String(formData.get("altTextId") ?? "");
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) return undefined;

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadImage(buffer, "bona-nauli-perkasa/news");
  const media = await prisma.media.create({
    data: { publicId: uploaded.publicId, url: uploaded.url, altTextEn, altTextId },
  });
  return media.id;
}

function readFields(formData: FormData) {
  return {
    titleEn: String(formData.get("titleEn") ?? ""),
    titleId: String(formData.get("titleId") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? ""),
    excerptId: String(formData.get("excerptId") ?? ""),
    bodyEn: String(formData.get("bodyEn") ?? ""),
    bodyId: String(formData.get("bodyId") ?? ""),
    authorName: String(formData.get("authorName") ?? "").trim() || "Bona Nauli Perkasa",
    status: formData.get("status") === "PUBLISHED" ? "PUBLISHED" as const : "DRAFT" as const,
  };
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const fields = readFields(formData);
  const coverMediaId = await uploadCover(formData);
  const baseSlug = slugify(fields.titleEn) || "article";
  const slug = await uniqueSlug(baseSlug);

  await prisma.blogPost.create({
    data: {
      ...fields,
      slug,
      coverMediaId,
      publishedAt: fields.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/en/news");
  revalidatePath("/id/news");
  redirect("/admin/blog?saved=1");
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const fields = readFields(formData);
  const coverMediaId = await uploadCover(formData);

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!coverMediaId && existing?.coverMediaId) {
    await prisma.media.update({
      where: { id: existing.coverMediaId },
      data: {
        altTextEn: String(formData.get("altTextEn") ?? ""),
        altTextId: String(formData.get("altTextId") ?? ""),
      },
    });
  }

  const publishedAt =
    fields.status === "PUBLISHED" && !existing?.publishedAt ? new Date() : undefined;

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...fields,
      ...(coverMediaId ? { coverMediaId } : {}),
      ...(publishedAt ? { publishedAt } : {}),
    },
  });

  revalidatePath("/en/news");
  revalidatePath("/id/news");
  revalidatePath(`/en/news/${existing?.slug}`);
  revalidatePath(`/id/news/${existing?.slug}`);
  redirect("/admin/blog?saved=1");
}

export async function deletePost(formData: FormData) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/en/news");
  revalidatePath("/id/news");
  redirect("/admin/blog?deleted=1");
}
