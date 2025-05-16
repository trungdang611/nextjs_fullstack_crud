"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface PostPayload {
  title: string;
  description: string;
  thumbnailURL: string;
  userId: string;
}

// Tạo mới bài viết
export async function createPost({
  title,
  description,
  thumbnailURL,
  userId,
}: PostPayload) {
  if (!title || !userId) {
    throw new Error("Title and userId are required");
  }

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

// Cập nhật bài viết
export async function updatePost(
  postId: string,
  { title, description, thumbnailURL }: Omit<PostPayload, "userId">
) {
  if (!title) throw new Error("Title is required");

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
