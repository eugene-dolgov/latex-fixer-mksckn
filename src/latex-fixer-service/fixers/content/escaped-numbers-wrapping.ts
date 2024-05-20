import { LatexFixer } from '../../models';

export const EscapedNumbersWrappingFixer: LatexFixer = {
  description: 'Wrap escaped numbers ("\\1" or "\\1." or "\\1.2" or "\\1.2)") with $...$',
  applyToText: (input: string) => {
    let result = '';
    let i = 0;
    let insideMath = false;
    let startIndex: number = 0;
    while (i < input.length) {
      if (insideMath) {
        if (input[i] !== '.' && input[i] !== ')' && !/\d/.test(input[i])) {
          insideMath = false;
          result += '$' + input.slice(startIndex + 1, i) + '$' + input[i];
        } else if (i === input.length - 1) {
          insideMath = false;
          result += '$' + input.slice(startIndex + 1, i + 1) + '$';
        }
      } else {
        if (input[i] === '\\' && i < input.length - 1 && /\d/.test(input[i + 1])) {
          startIndex = i;
          insideMath = true;
        } else {
          result += input[i];
        }
      }
      i++;
    }
    return result;
  },
};
