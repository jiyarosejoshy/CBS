import { NextResponse } from "next/server";
import { getUserByEmail } from "../../../lib/utils";

export async function POST(req) {
  const { email, password } = await req.json();
  const user = await getUserByEmail(email);

  if (!user || user.role !== password) {
    return NextResponse.json({ message: "Invalid email or role" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
