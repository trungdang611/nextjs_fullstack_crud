import PostForm from "@/components/PostForm";
import { createPost } from "@/app/actions/postActions";
import { prisma } from "@/lib/prisma";

export default async function NewPostPage() {
  // Lấy danh sách user từ database
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return <PostForm users={users} onSubmit={createPost} />;
}
