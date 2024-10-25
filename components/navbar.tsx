import Link from "next/link";
import { verifySession } from "@/lib/auth/session";
import { History } from "./history";
import { SignOutForm } from "./sign-out-form";

export const Navbar = async () => {
  const user = await verifySession();

  return (
    <div className="absolute left-0 top-0 z-30 flex w-dvw flex-row items-center justify-between border-b bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-row items-center gap-3">
        {user && <History />}
        <div className="text-sm dark:text-zinc-300">
          Internal Knowledge Base
        </div>
      </div>

      {user ? (
        <div className="group relative cursor-pointer rounded-md px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <div className="z-10 text-sm dark:text-zinc-400">{user.email}</div>
          <div className="absolute right-0 top-6 hidden w-full flex-col pt-5 group-hover:flex">
            <SignOutForm />
          </div>
        </div>
      ) : (
        <Link
          href="login"
          className="rounded-md bg-zinc-900 p-1 px-2 text-sm text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Login
        </Link>
      )}
    </div>
  );
};
