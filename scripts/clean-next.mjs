import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const nextDirectory = path.resolve(currentDirectory, "../.next");

try {
  await rm(nextDirectory, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200
  });
  console.log("Cleared .next cache before dev start.");
} catch (error) {
  console.warn("Unable to clear .next cache before dev start.", error);
}
