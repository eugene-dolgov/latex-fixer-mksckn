import { LatexFixer } from '../../models';

export const RoundBracketsFixer: LatexFixer = {
  description: 'Replace round brackets delimiters with $...$',
  // prettier-ignore
  // eslint-disable-next-line no-useless-escape
  applyToAll: (input: string) => input.replace(/\\\((.*?)\\\)/g, '$$$1$'),
};
