#!/usr/bin/env node

import { joyful } from "./index";

const args = process.argv.slice(2);

const parseFlag = (name: string, short: string): string | undefined => {
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === `--${name}` || args[i] === `-${short}`) {
      return args[i + 1];
    }
  }
  return undefined;
};

if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: joyful [options]

Options:
  -s, --segments <number>    Number of words to generate (default: 2)
  -p, --separator <string>   Separator between words (default: "-")
  -m, --max-length <number>  Maximum length of the result
  -h, --help                 Show this help message`);
  process.exit(0);
}

const segmentsRaw = parseFlag("segments", "s");
const separator = parseFlag("separator", "p");
const maxLengthRaw = parseFlag("max-length", "m");

const options: {
  segments?: number;
  separator?: string;
  maxLength?: number;
} = {};

if (segmentsRaw !== undefined) {
  options.segments = Number.parseInt(segmentsRaw, 10);
}

if (separator !== undefined) {
  options.separator = separator;
}

if (maxLengthRaw !== undefined) {
  options.maxLength = Number.parseInt(maxLengthRaw, 10);
}

try {
  console.log(joyful(options));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
