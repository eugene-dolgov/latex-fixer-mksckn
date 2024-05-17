import { LatexFixer } from '../../models';

export const ApostropheFixer: LatexFixer = {
  description: "Unescape apostrophe to have ' instead of \\'",
  applyToText: (input: string) => input.replace(/([a-zA-Z])\\'([a-zA-Z])/g, "$1'$2"),
};
