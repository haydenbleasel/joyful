/* eslint-disable eslint-plugin-import/no-nodejs-modules, eslint-plugin-jest/require-hook, eslint-plugin-import/no-relative-parent-imports */
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { friendlyWords } from "../src";

const libDir = join(import.meta.dirname, "../lib");
const files = readdirSync(libDir).filter((f) => f.endsWith(".json"));

const allWords: Record<string, string[]> = {};
for (const file of files) {
  const name = file.replace(".json", "");
  const module = await import(join(libDir, file));
  allWords[name] = module.default;
}

const { adjectives } = allWords;
const categories = Object.entries(allWords)
  .filter(([name]) => name !== "adjectives")
  .map(([, words]) => words);

const calculatePermutations = (segments: number): number => {
  if (segments < 2) {
    throw new Error("Need at least 2 words");
  }

  // Start with the number of adjectives
  let totalPermutations = adjectives.length;

  // Multiply by the total number of words in all other categories for each additional segment
  const totalWordsInCategories = categories.reduce(
    (sum, category) => sum + category.length,
    0
  );
  for (let i = 1; i < segments; i += 1) {
    totalPermutations *= totalWordsInCategories;
  }

  return totalPermutations;
};

// Calculate permutations for different numbers of segments
console.log("Possible permutations:");
for (let i = 2; i <= 5; i += 1) {
  console.log(`${i} words: ${calculatePermutations(i).toLocaleString()}`);
}

// Generate a sample of unique words
const uniqueWords = new Set<string>();
const sampleSize = 1000;
const maxAttempts = sampleSize * 10;

for (let i = 0; i < maxAttempts && uniqueWords.size < sampleSize; i += 1) {
  // Generate 5-word combinations
  uniqueWords.add(friendlyWords(5));
}

console.log(`\nUnique ${5}-word combinations generated: ${uniqueWords.size}`);
console.log("Sample of generated words:");
console.log([...uniqueWords].slice(0, 10).join("\n"));
