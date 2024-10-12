import { compare, genSaltSync, hashSync } from "bcrypt-ts";

export async function hashPassword(password: string) {
  const hashedPassword = hashSync(password, genSaltSync(10));
  return hashedPassword;
}

export async function isPasswordValid(
  password: string,
  hashedPassword: string,
) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
