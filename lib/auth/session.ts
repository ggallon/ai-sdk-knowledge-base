import "server-only";

import { cache } from "react";
import { auth } from "@/app/(auth)/auth";

export interface UserSession {
  id: string;
  name?: string;
  email: string;
  image?: string;
}

export const verifySession = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return undefined;
  }

  return session.user as UserSession;
});
