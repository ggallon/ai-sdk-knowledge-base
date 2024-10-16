import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthHeader } from "@/components/auth-header";
import { SubmitButton } from "@/components/submit-button";
import { register } from "../actions";

export default function RegisterPage() {
  return (
    <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
      <AuthHeader
        title="Sign Up"
        description="Create an account with your email and password"
      />
      <AuthForm type="register" action={register}>
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
      </AuthForm>
    </div>
  );
}
