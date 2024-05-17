import { Injectable } from '@nestjs/common';
import { CONTENT_LIST } from './content';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { LatexFixerService } from './latex-fixer-service';

const texvcjs = require('mathoid-texvcjs');

const EXPRESSIONS_TO_CHECK = [
  // '2 \\times 5',
  // `Julie has a string that is $\\frac{3}{8}$ yards long. Mark gives her another piece that is $\\frac{5}{8}$ yards long.`,
  // `Julie has \\$5 and Mark has \\$7.`,
  // `Julie has \$5 and Mark has \$7.`,
  // '\\$5',
  // '$\\text{Julie has }\\$\\text{5 and Mark has }\\$\\text{7.}$',
  // '\\text{Something}',
  'Correct. $(6 \\times 10,000)$ equals 60,000 and $(2 \\times 1,000)$ equals 2,000',
];

@Injectable()
export class AppService {
  constructor(private latexFixerService: LatexFixerService) {}

  getHello(): any {
    // return this.checkExpressions(EXPRESSIONS_TO_CHECK);
    return this.validateContent();
  }

  private validateContent(): string {
    if (existsSync('result.json')) {
      unlinkSync('result.json');
    }
    const results = [];
    CONTENT_LIST.forEach((contentItem) => {
      const mcq = JSON.parse(contentItem.content);
      const expressions: string[] = [mcq.question];
      mcq.answer_options.forEach((option) => {
        expressions.push(option.answer, option.explanation);
      });
      const result = {
        contentId: contentItem.id,
        standardName: contentItem.standard_name,
        list: this.checkExpressions(expressions),
      };
      results.push(result);
    });
    writeFileSync('result.json', JSON.stringify(results, null, 2));
    return 'Done';
  }

  private checkExpressions(expressions: string[]): any[] {
    const results = [];
    expressions.forEach((oldStr: string) => {
      const oldResult = texvcjs.check(oldStr);
      const newStr: string = this.latexFixerService.fix(oldStr);
      const newResult = texvcjs.check(newStr);
      const newReversedResult = texvcjs.check(
        (this.latexFixerService as any).reverseWrapping(newStr),
      );

      const result = {
        old: oldStr,
        oldResult: oldResult.status === '+' ? oldResult : oldResult.error,
        new: newStr,
        newResult: newResult.status === '+' ? newResult : newResult.error,
        newReversedResult: newReversedResult.status === '+'
          ? newReversedResult
          : newReversedResult.error,
      };
      results.push(result);
    });
    return results;
  }
}
