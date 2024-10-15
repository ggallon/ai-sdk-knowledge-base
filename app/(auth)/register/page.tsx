"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Form } from "@/components/form";
import { SubmitButton } from "@/components/submit-button";
import { register, type AuthActionState } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    switch (state.status) {
      case "failed":
        toast.error("Failed to create account");
        break;
      case "user_exists":
        toast.error("Account already exists");
        break;
      case "success":
        toast.success("Account created successfully");
        router.refresh();
        break;
    }
  }, [state, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-zinc-900">
      <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign Up</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Create an account with your email and password
          </p>
        </div>
        <Form action={formAction}>
          <SubmitButton>Sign Up</SubmitButton>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
            {"Already have an account? "}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
            {" instead."}
          </p>
        </Form>
      </div>
    </div>
  );
}
