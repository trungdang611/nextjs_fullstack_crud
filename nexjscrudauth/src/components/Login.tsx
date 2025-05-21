"use client";

import authAxios from "@/util/axios.config";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { emailRegex, strongPasswordRegex } from "@/util/regex";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateFields = () => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "Trường email không được để trống!";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Email không đúng định dạng!";
    }

    if (!password.trim()) {
      errors.password = "Trường password không được để trống!";
    } else if (password.length < 8) {
      errors.password = "Password phải từ 8 kí tự trở lên!";
    } else if (!strongPasswordRegex.test(password)) {
      errors.password =
        "Password phải chứa ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt!";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!validateFields()) {
      return;
    }

    try {
      const res = await authAxios.post("/api/users/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = res.data;

      // Lưu refresh token vào localStorage
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", JSON.stringify(user.id));
      localStorage.setItem("userEmail", JSON.stringify(user.email));
      localStorage.setItem("userFullname", JSON.stringify(user.fullname));

      router.push("/posts/list");
    } catch (err: any) {
      console.error("Lỗi login: ", err);

      setFieldErrors(err.response?.data?.fieldErrors || {});
    }
  };

  const inputClass = (fieldName: string) =>
    `w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
      fieldErrors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={inputClass("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className={inputClass("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-200"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-blue-600 font-medium hover:underline"
        >
          Register
        </a>
      </p>
    </form>
  );
}
