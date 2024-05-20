import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 14);

export function generateRandomUsername(): string {
  return nanoid();
}
