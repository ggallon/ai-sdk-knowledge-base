"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { AuthActionState } from "@/app/(auth)/actions";

export function AuthForm({
  type,
  action,
  children,
}: {
  type: "login" | "register";
  action: (
    data: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    action,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    switch (state.status) {
      case "failed":
        if (type === "login") {
          toast.error("Invalid credentials!");
        } else {
          toast.error("Failed to create account");
        }
        break;
      case "success":
        if (type === "register") {
          toast.success("Account created successfully");
        }
        router.refresh();
        break;
      case "user_exists":
        toast.error("Account already exists");
        break;
    }
  }, [type, state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4 px-4 sm:px-16">
      <div>
        <label
          htmlFor="email"
          className="block text-sm text-zinc-600 dark:text-zinc-400"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@acme.com"
          autoComplete="username"
          required
          className="mt-1 block w-full appearance-none rounded-md bg-zinc-100 px-3 py-2 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-black sm:text-sm dark:bg-zinc-700 dark:text-zinc-300"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm text-zinc-600 dark:text-zinc-400"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={
            type === "register" ? "new-password" : "current-password"
          }
          required
          className="mt-1 block w-full appearance-none rounded-md bg-zinc-100 px-3 py-2 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-black sm:text-sm dark:bg-zinc-700 dark:text-zinc-300"
        />
      </div>
      {children}
    </form>
  );
}
