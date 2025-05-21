import { privateKey } from "@/lib/keys";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { token } = await req.json();

  try {
    const payload = jwt.verify(token, privateKey, { algorithms: ["RS256"] });
    const accessToken = jwt.sign(payload as any, privateKey, {
      algorithm: "RS256",
      expiresIn: "15m",
    });

    return new Response(JSON.stringify({ accessToken }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Token không hợp lệ" }), {
      status: 401,
    });
  }
}
