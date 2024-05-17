import { LatexFixer } from '../../models';

export const UnderscoreFixer: LatexFixer = {
  description: 'Fix underscore to have \\_',
  applyToAll: (input: string) => {
    return input
      .replace(/\\textunderscore+/g, '_')
      .replace(/\\\\textunderscore+/g, '_')
      .replace(/\\_+/g, '_')
      .replace(/_+/g, '_')
      .replace(/(_\s*)+/g, match => {
        return `\\_${match.endsWith(' ') ? ' ' : ''}`;
      });
  },
};
