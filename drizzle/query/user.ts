import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { userTable, type User } from "@/drizzle/schema";
import { hashPassword } from "@/utils/hash";

export async function getUserByEmail(
  email: User["email"],
): Promise<Omit<User, "password"> | undefined> {
  return await db.query.userTable.findFirst({
    columns: { password: false },
    where: eq(userTable.email, email),
  });
}

export async function getUserById(
  userId: User["id"],
): Promise<Omit<User, "password"> | undefined> {
  return await db.query.userTable.findFirst({
    columns: { password: false },
    where: eq(userTable.id, userId),
  });
}

export async function getUserWithPassword(
  email: User["email"],
): Promise<Pick<User, "id" | "email" | "password"> | undefined> {
  return await db.query.userTable.findFirst({
    columns: { id: true, email: true, password: true },
    where: eq(userTable.email, email),
  });
}

export async function createUser(
  email: User["email"],
  password: User["password"],
) {
  const hash = await hashPassword(password);
  return await db.insert(userTable).values({ email, password: hash });
}
