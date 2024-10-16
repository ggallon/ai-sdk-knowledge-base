"use server";

import { createUser, getUser } from "@/drizzle/query/user";
import { signIn } from "./auth";
import { authSchema } from "./auth-schema";

export interface AuthActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "user_exists";
}

export const login = async (
  data: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  try {
    const validatedFields = authSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
      return { status: "failed" };
    }

    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    return { status: "success" };
  } catch {
    return { status: "failed" };
  }
};

export const register = async (
  data: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  try {
    const validatedFields = authSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
      return { status: "failed" };
    }

    const { email, password } = validatedFields.data;
    const user = await getUser(email);
    if (user) {
      return { status: "user_exists" };
    } else {
      await createUser(email, password);
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return { status: "success" };
    }
  } catch {
    return { status: "failed" };
  }
};
