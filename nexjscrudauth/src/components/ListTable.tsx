"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  title: string;
  description: string;
  thumbnailURL: string;
  createAt: string;
  user: string;
};

interface ListTableProps {
  data: Item[];
}

export default function ListTable({ data }: ListTableProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const getYouTubeEmbedURL = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0]; // lấy ID từ URL
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="mb-4 flex justify-between items-end">
        <input
          type="text"
          placeholder="Search by title, description or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 w-full max-w-md border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => router.push("/posts/new")}
          className="ml-4 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          New
        </button>
      </div>
      <div className="relative rounded-xl border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Thumbnail</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {item.description}
                  </td>
                  <td className="px-4 py-2">
                    <iframe
                      src={getYouTubeEmbedURL(item.thumbnailURL)}
                      className="h-25 w-40 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-600">{item.createAt}</td>
                  <td className="px-4 py-2 text-gray-600">{item.user}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push("/posts/update/" + item.id)}
                        className="px-3 py-1 text-sm font-medium text-white bg-yellow-600 rounded hover:bg-yellow-700 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
