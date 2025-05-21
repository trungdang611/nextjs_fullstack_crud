import { prisma } from "@/lib/prisma";
import {
  emailRegex,
  strongPasswordRegex,
  vietnameseNameRegex,
} from "@/util/regex";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email?.trim() || "";
  const password = body.password?.trim() || "";
  const fullname = body.fullname?.trim() || "";

  const fieldErrors: Record<string, string> = {};

  // Kiểm tra các trường rỗng
  if (!fullname) {
    fieldErrors.fullname = "Trường fullname không được để trống!";
  } else if (fullname.length < 2 || fullname.length > 50) {
    fieldErrors.fullname = "Fullname phải từ 2 đến 50 kí tự!";
  } else if (!vietnameseNameRegex.test(fullname)) {
    fieldErrors.fullname =
      "Tên không hợp lệ. Chỉ dùng chữ cái và khoảng trắng.";
  }

  if (!email) {
    fieldErrors.email = "Trường email không được để trống!";
  } else if (!emailRegex.test(email)) {
    fieldErrors.email = "Email không đúng định dạng!";
  }

  if (!password) {
    fieldErrors.password = "Trường password không được để trống!";
  } else if (password.length < 8) {
    fieldErrors.password = "Password phải từ 8 kí tự trở lên!";
  } else if (!strongPasswordRegex.test(password)) {
    fieldErrors.password =
      "Password phải chứa ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt!";
  }

  // Nếu có lỗi => trả về fieldErrors
  if (Object.keys(fieldErrors).length > 0) {
    return new Response(JSON.stringify({ fieldErrors }), { status: 400 });
  }

  // Kiểm tra email đã tồn tại
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ fieldErrors: { email: "Email đã tồn tại!" } }),
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullname: fullname,
        email: email,
        password: hashedPassword,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Đã đăng ký thành công!",
        user: newUser,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    return new Response(
      JSON.stringify({
        message: "Đã xảy ra lỗi khi tạo người dùng!",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
