export interface LatexSegment {
  content: string;
  innerContent?: string;
  isText: boolean;
  startIndex: number;
  endIndex: number;
  inner?: boolean;
  innerSegments?: LatexSegment[];
}
