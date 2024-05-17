import { LatexFixer } from '../../models';

export const TextSegmentFixer: LatexFixer = {
  description: 'Fix text segments escaping to have \\text',
  applyToAll: (input: string) => input.replace(/\text/g, '\\text'),
};
