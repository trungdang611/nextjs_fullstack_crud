// app/posts/update/[id]/page.tsx

import PostForm from "@/components/PostForm";
import { prisma } from "@/lib/prisma"; // bạn cần file prisma.ts
import { notFound } from "next/navigation";
import { updatePost } from "@/app/actions/postActions"; // nếu bạn có file này

type Props = {
  params: {
    id: string;
  };
};

type User = {
  id: string;
  name: string;
};

export default async function Page({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: post?.userId },
  });

  const users: User[] = [
    {
      id: user?.id ?? "",
      name: user?.name ?? "",
    },
  ];

  if (!post) {
    notFound();
  }

  return (
    <PostForm
      users={users} // TODO: truyền danh sách users
      defaultValues={{
        title: post.title,
        description: post.description ?? "",
        thumbnailURL: post.thumbnailURL,
        userId: post.userId,
      }}
      onSubmit={async (formData) => {
        "use server";
        await updatePost(post.id, formData);
      }}
    />
  );
}
