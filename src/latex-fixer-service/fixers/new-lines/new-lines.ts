import { LatexFixer } from '../../models';

export const NewLinesFixer: LatexFixer = {
  description: 'Replace new lines with \n',
  applyToAll: (input: string) => input.replace(/\\n(?!eq)/g, '\n'),
};
