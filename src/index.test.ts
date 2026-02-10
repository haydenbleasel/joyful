import { describe, expect, it } from "bun:test";

import { joyful } from "./index";

describe("joyful", () => {
  describe("default behavior", () => {
    it("returns a string with 2 words separated by hyphen by default", () => {
      const result = joyful();
      const words = result.split("-");
      expect(words).toHaveLength(2);
    });

    it("returns different results on multiple calls (randomness)", () => {
      const results = new Set<string>();
      for (let i = 0; i < 20; i += 1) {
        results.add(joyful());
      }
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe("segments parameter", () => {
    it("generates 3 words when segments is 3", () => {
      const result = joyful(3);
      const words = result.split("-");
      expect(words).toHaveLength(3);
    });

    it("generates 5 words when segments is 5", () => {
      const result = joyful(5);
      const words = result.split("-");
      expect(words).toHaveLength(5);
    });

    it("throws error when segments is less than 2", () => {
      expect(() => joyful(1)).toThrow("Need at least 2 words");
    });

    it("throws error when segments is 0", () => {
      expect(() => joyful(0)).toThrow("Need at least 2 words");
    });

    it("throws error when segments is negative", () => {
      expect(() => joyful(-1)).toThrow("Need at least 2 words");
    });
  });

  describe("separator parameter", () => {
    it("uses underscore as separator when specified", () => {
      const result = joyful(2, "_");
      expect(result).toContain("_");
      expect(result).not.toContain("-");
    });

    it("uses space as separator when specified", () => {
      const result = joyful(2, " ");
      expect(result).toContain(" ");
    });

    it("uses custom string as separator", () => {
      const result = joyful(2, "---");
      expect(result).toContain("---");
    });

    it("throws error when separator is empty string", () => {
      expect(() => joyful(2, "")).toThrow("Need a separator");
    });
  });

  describe("word uniqueness", () => {
    it("does not contain duplicate words", () => {
      for (let i = 0; i < 50; i += 1) {
        const result = joyful(5);
        const words = result.split("-");
        const uniqueWords = new Set(words);
        expect(uniqueWords.size).toBe(words.length);
      }
    });
  });

  describe("word format", () => {
    it("all words are lowercase", () => {
      for (let i = 0; i < 20; i += 1) {
        const result = joyful(3);
        const words = result.split("-");
        for (const word of words) {
          expect(word).toBe(word.toLowerCase());
        }
      }
    });

    it("all words are non-empty strings", () => {
      for (let i = 0; i < 20; i += 1) {
        const result = joyful(3);
        const words = result.split("-");
        for (const word of words) {
          expect(word.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("options object form", () => {
    it("accepts an options object with all properties", () => {
      const result = joyful({ maxLength: 40, segments: 3, separator: "_" });
      const words = result.split("_");
      expect(words).toHaveLength(3);
      expect(result.length).toBeLessThanOrEqual(40);
    });

    it("uses defaults when given an empty options object", () => {
      const result = joyful({});
      const words = result.split("-");
      expect(words).toHaveLength(2);
    });

    it("accepts partial options", () => {
      const result = joyful({ segments: 3 });
      const words = result.split("-");
      expect(words).toHaveLength(3);
    });
  });

  describe("maxLength constraint", () => {
    it("returns result within specified maxLength", () => {
      for (let i = 0; i < 50; i += 1) {
        const result = joyful({ maxLength: 15 });
        expect(result.length).toBeLessThanOrEqual(15);
      }
    });

    it("respects maxLength with custom segments and separator", () => {
      for (let i = 0; i < 50; i += 1) {
        const result = joyful({ maxLength: 20, segments: 3, separator: "_" });
        expect(result.length).toBeLessThanOrEqual(20);
        const words = result.split("_");
        expect(words).toHaveLength(3);
      }
    });

    it("works when maxLength is very generous", () => {
      for (let i = 0; i < 20; i += 1) {
        const result = joyful({ maxLength: 100 });
        expect(result.length).toBeLessThanOrEqual(100);
        const words = result.split("-");
        expect(words).toHaveLength(2);
      }
    });

    it("produces short results when maxLength is tight but achievable", () => {
      for (let i = 0; i < 50; i += 1) {
        const result = joyful({ maxLength: 8 });
        expect(result.length).toBeLessThanOrEqual(8);
        const words = result.split("-");
        expect(words).toHaveLength(2);
      }
    });

    it("works at the exact minimum boundary of 6", () => {
      for (let i = 0; i < 50; i += 1) {
        const result = joyful({ maxLength: 6 });
        expect(result.length).toBeLessThanOrEqual(6);
        const words = result.split("-");
        expect(words).toHaveLength(2);
      }
    });

    it("does not contain duplicate words under tight maxLength", () => {
      for (let i = 0; i < 50; i += 1) {
        const result = joyful({ maxLength: 12, segments: 3 });
        const words = result.split("-");
        const uniqueWords = new Set(words);
        expect(uniqueWords.size).toBe(words.length);
      }
    });

    it("respects maxLength with a multi-character separator", () => {
      for (let i = 0; i < 50; i += 1) {
        const result = joyful({ maxLength: 15, segments: 2, separator: "---" });
        expect(result.length).toBeLessThanOrEqual(15);
        expect(result).toContain("---");
      }
    });
  });

  describe("maxLength validation", () => {
    it("throws when maxLength is impossibly small", () => {
      expect(() => joyful({ maxLength: 3 })).toThrow("too short");
    });

    it("throws when maxLength is one below the minimum boundary", () => {
      expect(() => joyful({ maxLength: 5 })).toThrow("too short");
    });

    it("throws for maxLength of 0", () => {
      expect(() => joyful({ maxLength: 0 })).toThrow(
        "maxLength must be a positive integer"
      );
    });

    it("throws for negative maxLength", () => {
      expect(() => joyful({ maxLength: -5 })).toThrow(
        "maxLength must be a positive integer"
      );
    });

    it("throws for non-integer maxLength", () => {
      expect(() => joyful({ maxLength: 10.5 })).toThrow(
        "maxLength must be a positive integer"
      );
    });
  });

  describe("backwards compatibility", () => {
    it("works with positional arguments", () => {
      const result = joyful(3, "_");
      const words = result.split("_");
      expect(words).toHaveLength(3);
    });

    it("works with no arguments", () => {
      const result = joyful();
      const words = result.split("-");
      expect(words).toHaveLength(2);
    });

    it("works with segments only", () => {
      const result = joyful(4);
      const words = result.split("-");
      expect(words).toHaveLength(4);
    });
  });
});
