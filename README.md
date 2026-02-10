# joyful

Generate delightful, random word combinations for your app — perfect for project names, usernames, or unique identifiers.

## Installation

```bash
pnpm add joyful
```

## Usage

```ts
import { joyful } from "joyful";

joyful(); // "amber-fox"
joyful({ segments: 3 }); // "golden-marble-cathedral"
joyful({ segments: 3, separator: "_" }); // "swift_northern_lights"
joyful({ maxLength: 12 }); // "red-yak"
```

## API

### `joyful(options?)`

| Option      | Type     | Default | Description                           |
| ----------- | -------- | ------- | ------------------------------------- |
| `segments`  | `number` | `2`     | Number of words to generate           |
| `separator` | `string` | `"-"`   | Character(s) between words            |
| `maxLength` | `number` | —       | Maximum length of the returned string |

Returns a `string` of random words joined by the separator.

When `maxLength` is set, words are filtered to fit within the constraint. Throws if the limit is too short to produce a valid result.

## Word Categories

The first word is always a prefix (adjective or color). Subsequent words are drawn from:

animals, architecture, art, emotions, fashion, food, history, literature, music, mythology, nature, professions, science, space, sports, transportation

## Permutations

| Segments | Combinations           |
| -------- | ---------------------- |
| 2        | 700,295                |
| 3        | 2,160,410,075          |
| 4        | 6,664,865,081,375      |
| 5        | 20,561,108,776,041,876 |

## Credits

Based on [friendly-words](https://github.com/glitchdotcom/friendly-words) by Glitch, with curated word lists and additional categories.

## License

ISC
