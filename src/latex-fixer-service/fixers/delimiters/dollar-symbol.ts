import { LatexFixer } from '../../models';

export const DollarSymbolFixer: LatexFixer = {
  description: '',
  applyToAll: (input: string) => {
    const isDollar: (chars: string[], index: number) => boolean = (chars, index) => {
      return chars[index] === '$';
    };

    const isEscapedDollar: (chars: string[], index: number) => boolean = (chars, index) => {
      return isDollar(chars, index) && index > 0 && chars[index - 1] === '\\';
    };

    const isCurrencyDollar: (chars: string[], index: number) => boolean = (chars, index) => {
      return isDollar(chars, index) && index < chars.length - 1 && !isNaN(parseInt(chars[index + 1]));
    };

    const skipConsecutiveDollars: (chars: string[], index: number) => number = (chars, index) => {
      while (index > 0 && isDollar(chars, index - 1)) {
        index--;
      }
      return index;
    };

    const handleMathExpressionDollars: (chars: string[], index: number) => number = (chars, index) => {
      const endBlockIndex: number = index;
      index = skipConsecutiveDollars(chars, index);
      // Determine if it's closing or opening a math expression
      let foundMatchingDollar = false;
      for (let j = index - 1; j >= 0; j--) {
        if (isDollar(chars, j) && (j === 0 || chars[j - 1] !== '\\')) {
          foundMatchingDollar = true;
          index = j;
          index = skipConsecutiveDollars(chars, index);
          break;
        }
      }
      if (!foundMatchingDollar) {
        // It's a currency without matching $
        chars.splice(endBlockIndex, 1, '\\', '$');
      }
      return index;
    };

    const chars: string[] = Array.from(input);
    for (let i = chars.length - 1; i >= 0; i--) {
      if (!isDollar(chars, i)) {
        continue;
      }
      if (isEscapedDollar(chars, i)) {
        continue;
      } else if (isCurrencyDollar(chars, i)) {
        chars.splice(i, 1, '\\', '$');
      } else {
        i = handleMathExpressionDollars(chars, i);
      }
    }
    return chars.join('');
  },
};
