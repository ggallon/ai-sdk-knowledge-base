import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { AuthHeader } from "@/components/auth-header";
import { login } from "../actions";

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
      <AuthHeader
        title="Sign In"
        description="Use your email and password to sign in"
      />
      <AuthForm type="login" action={login}>
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
      </AuthForm>
    </div>
  );
}
