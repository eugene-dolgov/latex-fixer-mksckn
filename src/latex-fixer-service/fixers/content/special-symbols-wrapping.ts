import { LatexFixer } from '../../models';
import { EmptyMathSegmentsFixer } from '../delimiters';

const SYMBOLS = ['$', '_', '&', '%'];

export const SpecialSymbolsWrappingFixer: LatexFixer = {
  description: 'Wrap special symbols inside text with $...$',
  applyToText: (input: string) => {
    SYMBOLS.forEach((symbol: string) => {
      const escapedSymbol = `\\${symbol}`;
      if (input.includes(escapedSymbol)) {
        // We need double escaping when using new RegExp
        input = input.replace(new RegExp('\\' + escapedSymbol, 'g'), `$${escapedSymbol}$`);
        input = EmptyMathSegmentsFixer.applyToAll(input);
      }
    });
    return input;
  },
};
