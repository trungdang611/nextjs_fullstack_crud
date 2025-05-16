import React from "react";

type UserItem = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  postCount: number;
};

type ListTableUserProps = {
  data: UserItem[];
};

export default function ListTableUser({ data }: ListTableUserProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left font-semibold text-gray-700">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Posts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.description || "—"}</td>
              <td className="px-4 py-2">{user.createdAt}</td>
              <td className="px-4 py-2">{user.postCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
