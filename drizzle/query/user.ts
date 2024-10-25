import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { UserTable, type User } from "@/drizzle/schema";
import { hashPassword } from "@/utils/hash";

export async function getUserByEmail(
  email: User["email"],
): Promise<Omit<User, "password"> | undefined> {
  return await db.query.UserTable.findFirst({
    columns: { password: false },
    where: eq(UserTable.email, email),
  });
}

export async function getUserById(
  userId: User["id"],
): Promise<Omit<User, "password"> | undefined> {
  return await db.query.UserTable.findFirst({
    columns: { password: false },
    where: eq(UserTable.id, userId),
  });
}

export async function getUserWithPassword(
  email: User["email"],
): Promise<Omit<User, "createdAt"> | undefined> {
  return await db.query.UserTable.findFirst({
    columns: { id: true, email: true, password: true },
    where: eq(UserTable.email, email),
  });
}

export async function createUser(
  email: User["email"],
  password: User["password"],
) {
  const hash = await hashPassword(password);
  return await db.insert(UserTable).values({ email, password: hash });
}
