import { privateKey } from "@/lib/keys";
import { prisma } from "@/lib/prisma";
import { emailRegex, strongPasswordRegex } from "@/util/regex";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { email, password } = body;

  email?.trim();
  password?.trim();
  const fieldErrors: Record<string, string> = {};

  // Validate email
  if (!email?.trim()) {
    fieldErrors.email = "Trường email không được để trống!";
  } else if (!emailRegex.test(email.trim())) {
    fieldErrors.email = "Email không đúng định dạng!";
  }

  // Validate password
  if (!password?.trim()) {
    fieldErrors.password = "Trường password không được để trống!";
  } else if (password.length < 8) {
    fieldErrors.password = "Password phải từ 8 kí tự trở lên!";
  } else if (!strongPasswordRegex.test(password)) {
    fieldErrors.password =
      "Password phải chứa ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt!";
  }

  // Trả về lỗi nếu có
  if (Object.keys(fieldErrors).length > 0) {
    return new Response(JSON.stringify({ fieldErrors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Kiểm tra xem người dùng có tồn tại không
  if (!user) {
    return new Response(
      JSON.stringify({ fieldErrors: { email: "Email không đúng!" } }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response(
      JSON.stringify({ fieldErrors: { password: "Mật khẩu không đúng!" } }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const payload = { userId: user.id, email: user.email };

  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });

  try {
    // Save the refresh token to the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: refreshToken,
      },
    });

    return new Response(
      JSON.stringify({
        accessToken,
        refreshToken,
        user: { id: user.id, fullname: user.fullname, email: user.email },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Lỗi khi lưu refresh token!" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
