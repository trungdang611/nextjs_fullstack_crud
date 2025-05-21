import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 mt-20">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h1>
        <p className="text-gray-600 mb-6">
          Đây là trang chào mừng của ứng dụng CRUD.
        </p>
        <Link href="/login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Đăng nhập
          </button>
        </Link>
      </div>
    </div>
  );
}
