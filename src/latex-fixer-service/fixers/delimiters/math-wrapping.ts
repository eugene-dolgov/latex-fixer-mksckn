import { LatexFixer } from '../../models';

export const MathWrappingFixer: LatexFixer = {
  description:
    'Add $...$ wrapping if the string does not contain $ but includes escaped symbols (except \\_, \\{, \\} and cases with > 2 words)',
  applyToAll: (input: string) => {
    if (!input.includes('$') && /\\(?![_{}])/.test(input)) {
      const parts: string[] = input.split(' ');
      const wordsCount: number = parts.filter((part: string) => /^[a-zA-Z]+$/.test(part)).length;
      if (wordsCount === 0) {
        input = `$${input}$`;
      }
    }
    return input;
  },
};
