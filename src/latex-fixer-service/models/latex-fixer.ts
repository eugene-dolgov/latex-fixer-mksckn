export interface LatexFixer {
  description: string;
  applyToAll?: (input: string) => string;
  applyToText?: (input: string) => string;
  applyToLatex?: (input: string) => string;
}
