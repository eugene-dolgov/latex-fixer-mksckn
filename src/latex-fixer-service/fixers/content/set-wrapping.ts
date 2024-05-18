import { LatexFixer } from '../../models';

export const SetWrappingFixer: LatexFixer = {
  description: 'Wrap sets \\{1, 2, 3\\} with $...$',
  applyToText: (input: string) => {
    return input.replace(/\\{(.*?)\\}/g, '$\\{$1\\}$');
  },
};
