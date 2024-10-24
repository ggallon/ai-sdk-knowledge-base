import { signOut } from "@/app/(auth)/auth";

export const SignOutForm = () => {
  return (
    <form
      className="w-full"
      action={async () => {
        "use server";

        await signOut({
          redirectTo: "/",
        });
      }}
    >
      <button
        type="submit"
        className="w-full rounded-md bg-red-500 p-1 text-sm text-red-50 hover:bg-red-600"
      >
        Sign out
      </button>
    </form>
  );
};
