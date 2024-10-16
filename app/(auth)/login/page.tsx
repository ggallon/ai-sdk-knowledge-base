"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Form } from "@/components/form";
import { SubmitButton } from "@/components/submit-button";
import { login, type AuthActionState } from "../actions";
import { AuthHeader } from "@/components/auth-header";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<AuthActionState, FormData>(login, {
    status: "idle",
  });

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials!");
    } else if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
      <AuthHeader
        title="Sign In"
        description="Use your email and password to sign in"
      />
      <Form action={formAction}>
        <SubmitButton>Sign in</SubmitButton>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
          {"Don't have an account? "}
          <Link
            href="/register"
            className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
          >
            Sign up
          </Link>
          {" for free."}
        </p>
      </Form>
    </div>
  );
}
