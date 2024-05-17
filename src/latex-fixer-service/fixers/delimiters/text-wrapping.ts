import { LatexFixer } from '../../models';

export const TextWrappingFixer: LatexFixer = {
  description: 'Remove \\text{...} wrapping from text in case it is global',
  applyToAll: (input: string) => {
    if (input.startsWith('\\text{') && input.endsWith('}')) {
      const text: string = input.slice(6, -1);
      if (!text.includes('}')) {
        return text;
      }
    }
    return input;
  },
};
