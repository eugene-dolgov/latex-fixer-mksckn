import { LatexFixer } from '../../models';

export const FracFixer: LatexFixer = {
  description: 'Fix frac escaping to have \\frac',
  applyToLatex: (input: string) => input.replace(/\frac/g, '\\frac'),
};
