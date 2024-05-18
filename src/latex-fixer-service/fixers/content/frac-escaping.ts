import { LatexFixer } from '../../models';

export const FracEscapingFixer: LatexFixer = {
  description: 'Fix frac escaping to have \\frac',
  applyToLatex: (input: string) => input.replace(/\frac/g, '\\frac'),
};
