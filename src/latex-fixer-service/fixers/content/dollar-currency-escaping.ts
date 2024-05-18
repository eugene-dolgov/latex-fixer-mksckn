import { LatexFixer } from '../../models';

export const DollarCurrencyEscapingFixer: LatexFixer = {
  description: 'Replace DOLLAR_SIGN text with currency symbol \\$',
  applyToAll: (input: string) => {
    return input.replace(/DOLLAR_SIGN/g, '\\$').replace(/DOLLAR\\_SIGN/g, '\\$');
  },
};
