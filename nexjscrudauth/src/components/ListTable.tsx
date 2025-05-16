import React from "react";

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
  const getYouTubeEmbedURL = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0]; // lấy ID từ URL
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left font-semibold text-gray-700">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Thumbnail</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">User</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium text-gray-900">
                {item.title}
              </td>
              <td className="px-4 py-2 text-gray-700">{item.description}</td>
              <td className="px-4 py-2">
                <iframe
                  src={getYouTubeEmbedURL(item.thumbnailURL)}
                  className="h-25 w-40 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2 text-gray-600">{item.createAt}</td>
              <td className="px-4 py-2 text-gray-600">{item.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
