import { LatexFixer } from '../../models';

export const EmptyMathSegmentsFixer: LatexFixer = {
  description: 'Remove empty math segments (i.e. $$ but except \\$$)',
  applyToAll: (input: string) => input.replace(/(?<!\\)\$\$/g, ''),
};
