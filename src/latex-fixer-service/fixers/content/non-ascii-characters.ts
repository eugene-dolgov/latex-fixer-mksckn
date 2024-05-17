import { LatexFixer } from '../../models';

const REPLACEMENTS_MAP: Map<string, string> = new Map([
  ['«', '"'],
  ['»', '"'],
  ['…', '...'],
  ['′', "'"],
  ['″', '"'],
  ['∗', '*'],
  ['≥', '>='],
  ['≤', '<='],
  ['≠', '!='],
  ['≈', '~='],
  ['⋅', '*'],
  ['‘', "'"],
  ['’', "'"],
  ['“', '"'],
  ['”', '"'],
  ['„', '"'],
  ['‹', '<'],
  ['›', '>'],
]);

export const NonAsciiCharactersFixer: LatexFixer = {
  description: 'Replace all non-ASCII characters with ASCII',
  applyToAll: (input: string) => {
    return Array.from(REPLACEMENTS_MAP).reduce((acc, [key, value]) => {
      return acc.replace(key, value);
    }, input);
  },
};
