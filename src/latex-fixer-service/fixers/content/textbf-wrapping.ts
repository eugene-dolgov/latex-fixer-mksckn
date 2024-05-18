import { LatexFixer } from '../../models';

export const TextbfWrappingFixer: LatexFixer = {
  description: 'Wrap \\textbf{...} with $\\textbf{...}$',
  applyToText: (input: string) => {
    return input.replace(/\\textbf\{(.*?)\}/g, '$\\textbf{$1}$');
  },
};
