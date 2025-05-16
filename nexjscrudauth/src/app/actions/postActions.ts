"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function updatePost(postId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const thumbnailURL = formData.get("thumbnailURL") as string;

  if (!title) {
    throw new Error("Title is required");
  }
  if (!thumbnailURL) {
    throw new Error("ThumbnailURL is required");
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      description,
      thumbnailURL,
    },
  });

  revalidatePath("/posts");
}
