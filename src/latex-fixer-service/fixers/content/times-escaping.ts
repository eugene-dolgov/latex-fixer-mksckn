import { LatexFixer } from '../../models';

export const TimesEscapingFixer: LatexFixer = {
  description: 'Fix times escaping to have \\times',
  applyToLatex: (input: string) => input.replace(/\times/g, '\\times'),
};
