import texvcjs from 'mathoid-texvcjs';
import * as Fixers from './fixers';
import { LatexFixer, LatexSegment } from './models';

// Order is important here
export const DELIMITER_FIXERS = [
  Fixers.RoundBracketsFixer,
  Fixers.SquareBracketsFixer,
  Fixers.TextSegmentFixer,
  Fixers.DollarSymbolFixer,
  Fixers.TextWrappingFixer,
  Fixers.MathWrappingFixer,
  Fixers.EmptyMathSegmentsFixer,
];

// Order is important here
export const CONTENT_FIXERS = [
  Fixers.ApostropheFixer,
  Fixers.DollarCurrencyFixer,
  Fixers.FracFixer,
  Fixers.NonAsciiCharactersFixer,
  Fixers.NumbersWithDelimitersFixer,
  Fixers.TimesFixer,
  Fixers.UnderscoreFixer,
  // Need to run at the end
  Fixers.SpecialSymbolsWrappingFixer,
];

export class LatexFixerService {
  constructor(private readonly fixers: LatexFixer[] = CONTENT_FIXERS) {}

  fix(input: string): string {
    input = this.applyFixer(input, Fixers.NewLinesFixer.applyToAll);
    const parts: string[] = input.split('\n');
    parts.forEach((part: string, index: number) => {
      if (part) {
        parts[index] = this.fixLine(part);
      }
    });
    return parts.join('\n');
  }

  getInvalidExpressions(allExpressions: string[]): string[] {
    const invalidExpressions: string[] = [];
    allExpressions.forEach((expression: string) => {
      if (!this.validate(expression)) {
        invalidExpressions.push(expression);
      }
    });
    return invalidExpressions;
  }

  validate(input: string): boolean {
    const reversedInput: string = this.reverseWrapping(input);
    const result: { status: string } = texvcjs.check(reversedInput);
    return result.status === '+';
  }

  private fixLine(input: string): string {
    input = this.fixDelimiters(input);
    const segments: LatexSegment[] = this.splitToSegments(input);
    const fixedSegments: LatexSegment[] = this.fixSegments(segments);
    return fixedSegments
      .map((segment: LatexSegment) => segment.content)
      .join('');
  }

  private fixSegments(segments: LatexSegment[]): LatexSegment[] {
    return segments.map((originalSegment: LatexSegment) => {
      const segment: LatexSegment = { ...originalSegment };
      let content: string;
      if (segment.innerSegments) {
        segment.innerSegments = this.fixSegments(segment.innerSegments);
        content = segment.innerSegments
          .map((innerSegment: LatexSegment) => innerSegment.content)
          .join('');
      } else {
        content = segment.innerContent || segment.content;
        this.fixers.forEach((fixer: LatexFixer) => {
          if (fixer.applyToText && segment.isText) {
            content = fixer.applyToText(content);
          } else if (fixer.applyToLatex && !segment.isText) {
            content = fixer.applyToLatex(content);
          }
          if (fixer.applyToAll) {
            content = fixer.applyToAll(content);
          }
        });
      }
      if (segment.innerContent) {
        segment.innerContent = content;
        if (!segment.isText) {
          segment.content = `$${content}$`;
        }
      } else {
        segment.content = content;
      }
      return segment;
    });
  }

  private fixDelimiters(input: string): string {
    DELIMITER_FIXERS.forEach((fixer: LatexFixer) => {
      input = this.applyFixer(input, fixer.applyToAll);
    });
    return input;
  }

  private splitToSegments(input: string): LatexSegment[] {
    const segments: LatexSegment[] = [];
    let inMathBlock = false;
    let segmentStartIndex: number = 0;

    for (let i = 0; i < input.length; i++) {
      const char: string = input.charAt(i);
      if (!this.isMathDelimiter(char, input, i)) {
        continue;
      }
      inMathBlock = !inMathBlock;
      if (inMathBlock) {
        if (i !== segmentStartIndex) {
          segments.push({
            content: input.substring(segmentStartIndex, i),
            isText: true,
            startIndex: segmentStartIndex,
            endIndex: i - 1,
          });
          segmentStartIndex = i;
        }
      } else {
        const content: string = input.substring(segmentStartIndex, i + 1);
        segments.push({
          content,
          innerContent: content.slice(1, -1),
          isText: false,
          startIndex: segmentStartIndex,
          endIndex: i,
        });
        segmentStartIndex = i + 1;
      }
    }
    if (segmentStartIndex < input.length) {
      segments.push({
        content: input.substring(segmentStartIndex),
        isText: true,
        startIndex: segmentStartIndex,
        endIndex: input.length - 1,
      });
    }

    for (const segment of segments) {
      if (!segment.isText) {
        segment.innerSegments = this.splitToInnerSegments(segment.innerContent);
      }
    }

    return segments;
  }

  private splitToInnerSegments(input: string): LatexSegment[] {
    const segments: LatexSegment[] = [];
    let depth = 0;
    let inTextBlock = false;
    let blockStartIndex = 0;
    for (let i = 0; i < input.length; i++) {
      if (!inTextBlock) {
        const newIndex: number = this.detectTextInnerSegmentStart(input, i);
        if (newIndex === -1) {
          continue;
        }
        if (i !== blockStartIndex) {
          segments.push({
            content: input.substring(blockStartIndex, i),
            isText: false,
            startIndex: blockStartIndex,
            endIndex: i - 1,
            inner: true,
          });
          blockStartIndex = i;
        }
        i = newIndex;
        inTextBlock = true;
      } else {
        if (this.isInnerSegmentStart(input, i)) {
          depth++;
        }
        if (
          this.isInnerSegmentStart(input, i) ||
          !this.isInnerSegmentEnd(input, i)
        ) {
          continue;
        }
        if (depth === 0) {
          const textBlock: string = input.substring(blockStartIndex, i + 1);
          segments.push({
            content: textBlock,
            isText: true,
            startIndex: blockStartIndex,
            endIndex: i,
            inner: true,
          });
          i = blockStartIndex + textBlock.length;
          blockStartIndex = i;
          inTextBlock = false;
        } else {
          depth--;
        }
      }
    }
    if (blockStartIndex < input.length) {
      segments.push({
        content: input.substring(blockStartIndex),
        isText: false,
        startIndex: blockStartIndex,
        endIndex: input.length - 1,
        inner: true,
      });
    }
    return segments;
  }

  private reverseWrapping(input: string): string {
    const lines: string[] = input.split('\n');
    lines.forEach((line: string, lineIndex: number) => {
      if (!line) {
        return;
      }
      const segments: LatexSegment[] = this.splitToSegments(line);
      const reversedSegments: LatexSegment[] =
        this.reverseSegmentsWrapping(segments);
      lines[lineIndex] = reversedSegments
        .map((segment: LatexSegment) => segment.content)
        .join('');
      lines[lineIndex] = `$${lines[lineIndex]}$`;
    });
    return lines.join('\n');
  }

  private reverseSegmentsWrapping(segments: LatexSegment[]): LatexSegment[] {
    return segments.map((originalSegment: LatexSegment) => {
      const segment: LatexSegment = { ...originalSegment };
      if (!segment.inner) {
        if (segment.isText) {
          segment.innerContent = segment.content;
          segment.content = `\\text{${segment.content}}`;
        } else {
          segment.content = segment.innerContent;
          delete segment.innerContent;
        }
      }
      return segment;
    });
  }

  private isMathDelimiter(char: string, input: string, index: number): boolean {
    return char === '$' && (index === 0 || input.charAt(index - 1) !== '\\');
  }

  private detectTextInnerSegmentStart(input: string, index: number): number {
    if (input.substring(index, index + 6) === '\\text{') {
      return index + 6;
    }
    return -1;
  }

  private isInnerSegmentStart(input: string, index: number): boolean {
    return input[index] === '{';
  }

  private isInnerSegmentEnd(input: string, index: number): boolean {
    return input[index] === '}';
  }

  private applyFixer(input: string, fixer?: (input: string) => string): string {
    if (!fixer) {
      throw new Error('Fixer not found');
    }
    return fixer(input);
  }
}
