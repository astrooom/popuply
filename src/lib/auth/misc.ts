import { generateIdFromEntropySize } from "lucia";

export function generateUserId() {
  return generateIdFromEntropySize(10);
}