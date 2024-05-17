import { LatexFixer } from '../../models';

export const SquareBracketsFixer: LatexFixer = {
  description: 'Replace square brackets delimiters with $...$',
  // prettier-ignore
  // eslint-disable-next-line no-useless-escape
  applyToAll: (input: string) => input.replace(/\\\[(.*?)\\\]/g, '$$$1$'),
};
