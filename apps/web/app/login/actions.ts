"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiPost } from "../../lib/api";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const response = await apiPost<{ accessToken: string; user: { name: string } }>(
    "/auth/login",
    { email, password },
    false
  );

  (await cookies()).set("token", response.accessToken, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/"
  });

  redirect("/");
}
