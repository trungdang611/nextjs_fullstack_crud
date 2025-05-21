"use client";

import authAxios from "@/util/axios.config";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { emailRegex, vietnameseNameRegex } from "@/util/regex";

export default function Register() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateFields = () => {
    const errors: Record<string, string> = {};

    if (!fullname.trim()) {
      errors.fullname = "Trường fullname không được để trống!";
    } else if (fullname.length < 2 || fullname.length > 50) {
      errors.fullname = "Fullname phải từ 2 đến 50 kí tự!";
    } else if (!vietnameseNameRegex.test(fullname)) {
      errors.fullname = "Tên không hợp lệ. Chỉ dùng chữ cái và khoảng trắng.";
    }

    if (!email.trim()) {
      errors.email = "Trường email không được để trống!";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email không đúng định dạng!";
    }

    if (!password.trim()) {
      errors.password = "Trường password không được để trống!";
    } else if (password.length < 6 || password.length > 15) {
      errors.password = "Password phải từ 6 đến 15 kí tự!";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const actionSubmit = async (prevState: any, formData: FormData) => {
    const fullname = formData.get("fullname")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";

    // Kiểm tra các trường rỗng
    if (!validateFields()) {
      console.log(fieldErrors);
      return {
        success: false,
        message: "Vui lòng kiểm tra lại thông tin!",
        fieldErrors,
      };
    }

    try {
      const res = await authAxios.post("api/users/register", {
        fullname,
        email,
        password,
      });
      return {
        success: true,
        message: res.data.message || "Đăng ký thành công",
        fieldErrors: {},
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Đăng ký thất bại",
        fieldErrors: error.response?.data?.fieldErrors || {},
      };
    }
  };

  const [state, formAction, isPending] = useActionState(actionSubmit, {
    success: false,
    message: "",
    fieldErrors: {},
  });

  // Chuyển trang nếu đăng ký thành công
  useEffect(() => {
    if (state.success) {
      alert(state.message);
      router.push("/login");
    }
  }, [state.success, state.message, router]);

  //fix if else
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullname":
        setFullname(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  // Hàm tiện lợi để kiểm tra lỗi và gán class
  const inputClass = (fieldName: string) =>
    `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
      state.fieldErrors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create your account
        </h2>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={fullname}
              onChange={handleChange}
              className={inputClass("fullname")}
            />
            {state.fieldErrors.fullname && (
              <p className="text-sm text-red-600 mt-1">
                {state.fieldErrors.fullname}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className={inputClass("email")}
            />
            {state.fieldErrors.email && (
              <p className="text-sm text-red-600 mt-1">
                {state.fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className={inputClass("password")}
            />
            {state.fieldErrors.password && (
              <p className="text-sm text-red-600 mt-1">
                {state.fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPending ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
