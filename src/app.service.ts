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
  private validated = false;

  constructor(private latexFixerService: LatexFixerService) {}

  getHello(): any {
    // return this.checkExpressions(EXPRESSIONS_TO_CHECK);
    return this.validateContent();
  }

  private validateContent(): string {
    if (this.validated) {
      return 'Done';
    }
    if (existsSync('result.json')) {
      unlinkSync('result.json');
    }
    const results = [];
    CONTENT_LIST.forEach((contentItem, index) => {
      const mcq = JSON.parse(contentItem.content);
      const expressions: string[] = [mcq.question];
      mcq.answer_options.forEach((option) => {
        expressions.push(option.answer, option.explanation);
      });
      const result = {
        contentId: contentItem.id,
        standardName: contentItem.standard_name,
        expressions: this.checkExpressions(expressions),
      };
      results.push(result);
      console.log(`Done ${index + 1} / ${CONTENT_LIST.length}`);
    });
    writeFileSync('result.json', JSON.stringify(results, null, 2));
    console.log('Done, result.json saved.');
    this.validated = true;
    return 'Done';
  }

  private checkExpressions(expressions: string[]): any[] {
    const results = [];
    expressions.forEach((oldStr: string) => {
      const oldResult = texvcjs.check(oldStr);
      const newStr: string = this.latexFixerService.fix(oldStr);
      const newResult = texvcjs.check(newStr);
      const newReversedStr = (this.latexFixerService as any).reverseWrapping(newStr);
      const newReversedResult = texvcjs.check(newReversedStr);

      const result = {
        original: oldStr,
        originalValid: oldResult.status === '+' ? true : oldResult.error,
        fixed: newStr,
        fixedValid: newResult.status === '+' ? true : newResult.error,
        reversed: newReversedStr,
        reversedValid: newReversedResult.status === '+'
          ? true
          : newReversedResult.error,
      };
      results.push(result);
    });
    return results;
  }
}
