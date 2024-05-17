import { LatexFixer } from '../../models';

export const NumbersWithDelimitersFixer: LatexFixer = {
  description: 'Replace delimiters {,} in numbers to comma',
  applyToText: (input: string) => input.replace(/(\d)\{,\}(\d)/g, '$1,$2'),
};
