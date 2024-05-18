import { LatexFixer } from '../../models';
import { EmptyMathSegmentsFixer } from '../delimiters';

const SYMBOLS = ['$', '_', '&', '%'];

export const SpecialSymbolsWrappingFixer: LatexFixer = {
  description: 'Wrap special symbols inside text with $...$',
  applyToText: (input: string) => {
    SYMBOLS.forEach((symbol: string) => {
      const escapedSymbol = `\\${symbol}`;
      if (input.includes(escapedSymbol)) {
        let result = '';
        for (let i = 0; i < input.length; i++) {
          if (input.substring(i, i + escapedSymbol.length) === escapedSymbol) {
            result += `$${escapedSymbol}$`;
            i += escapedSymbol.length - 1;
          } else {
            result += input[i];
          }
        }
        input = result;
        input = EmptyMathSegmentsFixer.applyToAll(input);
      }
    });
    return input;
  },
};
