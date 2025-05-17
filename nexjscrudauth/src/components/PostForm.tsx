"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type User = {
  id: string;
  name: string;
};

type PostFormProps = {
  users: User[]; // danh sách user để chọn
  onSubmit: (formData: FormData) => Promise<void>;
  defaultValues?: {
    id?: string;
    title?: string;
    description?: string;
    thumbnailURL?: string;
    userId?: string;
  };
};

export default function PostForm({
  users,
  onSubmit,
  defaultValues,
}: PostFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedUserId, setSelectedUserId] = useState(
    defaultValues?.userId || ""
  );

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("userId", selectedUserId);

    startTransition(async () => {
      try {
        await onSubmit(formData);
        alert("Post submitted successfully!");
        router.push("/posts/list");
      } catch (error) {
        alert("Error submitting post.");
        console.error(error);
      }
    });
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={defaultValues?.title || ""}
          className="border border-gray-300 rounded p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description || ""}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="thumbnailURL" className="block text-gray-700 mb-1">
          YouTube Video URL (thumbnailURL)
        </label>
        <input
          type="url"
          id="thumbnailURL"
          name="thumbnailURL"
          defaultValue={defaultValues?.thumbnailURL || ""}
          className="border border-gray-300 rounded p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="userId" className="block text-gray-700 mb-1">
          Select User
        </label>
        <select
          id="userId"
          name="userId"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
          required
        >
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
