import { LatexFixer } from '../../models';

export const FracWrappingFixer: LatexFixer = {
  description: 'Wrap \\frac{...} with $\\frac{...}$',
  applyToText: (input: string) => {
    return input.replace(/\\frac{(.*?)}{(.*?)}/g, '$\\frac{$1}{$2}$');
  },
};
