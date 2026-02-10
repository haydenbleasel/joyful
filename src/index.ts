import adjectives from "../lib/adjectives.json" assert { type: "json" };
import animals from "../lib/animals.json" assert { type: "json" };
import architecture from "../lib/architecture.json" assert { type: "json" };
import art from "../lib/art.json" assert { type: "json" };
import colors from "../lib/colors.json" assert { type: "json" };
import emotions from "../lib/emotions.json" assert { type: "json" };
import fashion from "../lib/fashion.json" assert { type: "json" };
import food from "../lib/food.json" assert { type: "json" };
import history from "../lib/history.json" assert { type: "json" };
import literature from "../lib/literature.json" assert { type: "json" };
import music from "../lib/music.json" assert { type: "json" };
import mythology from "../lib/mythology.json" assert { type: "json" };
import nature from "../lib/nature.json" assert { type: "json" };
import professions from "../lib/professions.json" assert { type: "json" };
import science from "../lib/science.json" assert { type: "json" };
import space from "../lib/space.json" assert { type: "json" };
import sports from "../lib/sports.json" assert { type: "json" };
import transportation from "../lib/transportation.json" assert { type: "json" };

export interface JoyfulOptions {
  maxLength?: number;
  segments?: number;
  separator?: string;
}

const MIN_CATEGORY_WORD_LENGTH = 2;

const prefixes = [...adjectives, ...colors];

const categories = [
  animals,
  architecture,
  art,
  emotions,
  fashion,
  food,
  history,
  literature,
  music,
  mythology,
  nature,
  professions,
  science,
  space,
  sports,
  transportation,
];

const getRandomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const validateInput = (
  segments: number,
  separator: string,
  maxLength?: number
): void => {
  if (segments < 2) {
    throw new Error("Need at least 2 words");
  }

  if (!separator) {
    throw new Error("Need a separator");
  }

  if (
    maxLength !== undefined &&
    (!Number.isInteger(maxLength) || maxLength <= 0)
  ) {
    throw new Error("maxLength must be a positive integer");
  }
};

const getUniqueWord = (words: string[], maxWordLength?: number): string => {
  const category = getRandomElement(categories);
  const pool =
    maxWordLength === undefined
      ? category
      : category.filter((w) => w.length <= maxWordLength);

  if (pool.length === 0) {
    return getUniqueWord(words, maxWordLength);
  }

  const word = getRandomElement(pool);
  return words.includes(word) ? getUniqueWord(words, maxWordLength) : word;
};

const generateUnbounded = (segments: number, separator: string): string => {
  const words: string[] = [getRandomElement(prefixes)];

  for (let index = 1; index < segments; index += 1) {
    words.push(getUniqueWord(words));
  }

  return words.join(separator);
};

const tooShortError = (
  maxLength: number,
  segments: number,
  separator: string
): Error =>
  new Error(
    `maxLength ${maxLength} is too short to generate ${segments} segments with separator "${separator}"`
  );

const pickBoundedPrefix = (
  budget: number,
  segments: number
): string | undefined => {
  const maxPrefixLength = budget - (segments - 1) * MIN_CATEGORY_WORD_LENGTH;
  const filtered = prefixes.filter((w) => w.length <= maxPrefixLength);
  return filtered.length === 0 ? undefined : getRandomElement(filtered);
};

const pickBoundedWord = (
  words: string[],
  budget: number,
  remainingAfter: number
): string | undefined => {
  const maxWordLength = budget - remainingAfter * MIN_CATEGORY_WORD_LENGTH;
  const hasValid = categories.flat().some((w) => w.length <= maxWordLength);
  return hasValid ? getUniqueWord(words, maxWordLength) : undefined;
};

const fillBoundedWords = (
  words: string[],
  segments: number,
  budget: number,
  maxLength: number,
  separator: string
): number => {
  let remaining = budget;

  for (let index = 1; index < segments; index += 1) {
    const word = pickBoundedWord(words, remaining, segments - index - 1);

    if (!word) {
      throw tooShortError(maxLength, segments, separator);
    }

    words.push(word);
    remaining -= word.length;
  }

  return remaining;
};

const generateBounded = (
  segments: number,
  separator: string,
  maxLength: number
): string => {
  const budget = maxLength - (segments - 1) * separator.length;
  const prefix = pickBoundedPrefix(budget, segments);

  if (!prefix) {
    throw tooShortError(maxLength, segments, separator);
  }

  const words: string[] = [prefix];
  fillBoundedWords(
    words,
    segments,
    budget - prefix.length,
    maxLength,
    separator
  );
  return words.join(separator);
};

const parseArgs = (
  segmentsOrOptions?: number | JoyfulOptions,
  separatorArg?: string
): { maxLength: number | undefined; segments: number; separator: string } => {
  if (typeof segmentsOrOptions === "object" && segmentsOrOptions !== null) {
    const { maxLength, segments = 2, separator = "-" } = segmentsOrOptions;
    return { maxLength, segments, separator };
  }

  return {
    maxLength: undefined,
    segments: segmentsOrOptions ?? 2,
    separator: separatorArg ?? "-",
  };
};

export function joyful(segments?: number, separator?: string): string;
export function joyful(options: JoyfulOptions): string;
export function joyful(
  segmentsOrOptions?: number | JoyfulOptions,
  separatorArg?: string
): string {
  const { maxLength, segments, separator } = parseArgs(
    segmentsOrOptions,
    separatorArg
  );

  validateInput(segments, separator, maxLength);

  if (maxLength === undefined) {
    return generateUnbounded(segments, separator);
  }

  return generateBounded(segments, separator, maxLength);
}
