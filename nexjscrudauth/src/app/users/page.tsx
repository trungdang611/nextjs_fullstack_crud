import ListTableUser from "@/components/ListTableUser";
import { prisma } from "@/lib/prisma";

export default async function ListUserPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    description: user.description ?? "",
    createdAt: user.createdAt.toISOString().split("T")[0],
    postCount: user._count.posts,
  }));

  return (
    <>
      <h1 className="text-center font-bold text-3xl mb-5">All Users</h1>
      <ListTableUser data={data} />
    </>
  );
}
