import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isPasswordValid } from "@/utils/hash";
import { getUserWithPassword } from "@/drizzle/query/user";
import { authConfig } from "./auth.config";
import { authSchema } from "./auth-schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const validatedFields = authSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await getUserWithPassword(email);
        if (!user) return null;

        const passwordsMatch = await isPasswordValid(password, user.password);
        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
});
