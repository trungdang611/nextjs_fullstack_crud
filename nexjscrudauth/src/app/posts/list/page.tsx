import ListTable from "@/components/ListTable";
import { prisma } from "@/lib/prisma";

export default async function page() {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
    },
  });

  const users = await prisma.user.findMany();

  const data = posts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description ?? "",
    thumbnailURL: post.thumbnailURL ?? "",
    createAt: post.createdAt.toISOString().split("T")[0],
    user: post.user.name ?? "Unknown",
  }));

  return (
    <>
      <h1 className="text-center font-bold text-3xl mb-5">All Post</h1>
      <ul className="mb-3 flex flex-wrap gap-5 list-none">
        <li>
          <a href="/list-post">All</a>
        </li>
        {users.map((user) => (
          <li key={user.id}>
            <a href="">{user.name}</a>
          </li>
        ))}
      </ul>
      <ListTable data={data} />
    </>
  );
}
