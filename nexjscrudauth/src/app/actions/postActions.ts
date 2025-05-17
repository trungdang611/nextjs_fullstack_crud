"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const thumbnailURL = formData.get("thumbnailURL") as string;
  const userId = formData.get("userId") as string;

  await prisma.post.create({
    data: {
      title,
      description,
      thumbnailURL,
      userId,
    },
  });
  revalidatePath("/posts");
}

// GET: lấy 1 post theo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  return NextResponse.json(post);
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const thumbnailURL = formData.get("thumbnailURL") as string;
  const userId = formData.get("userId") as string;

  const updated = await prisma.post.update({
    where: { id },
    data: {
      title,
      description,
      thumbnailURL,
      userId,
    },
  });

  revalidatePath("/posts");
  return updated;
}
