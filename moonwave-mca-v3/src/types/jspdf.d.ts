// Type declarations for optional jspdf library
// This allows the project to compile even without jspdf installed

declare module 'jspdf' {
  interface jsPDFOptions {
    orientation?: 'portrait' | 'landscape' | 'p' | 'l';
    unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc';
    format?: string | [number, number];
    compress?: boolean;
    precision?: number;
    putOnlyUsedFonts?: boolean;
    userUnit?: number;
    floatPrecision?: number | 'smart';
  }

  interface TextOptionsLight {
    align?: 'left' | 'center' | 'right' | 'justify';
    baseline?: 'alphabetic' | 'ideographic' | 'bottom' | 'top' | 'middle' | 'hanging';
    angle?: number;
    rotationDirection?: 0 | 1;
    charSpace?: number;
    lineHeightFactor?: number;
    maxWidth?: number;
    renderingMode?:
      | 'fill'
      | 'stroke'
      | 'fillThenStroke'
      | 'invisible'
      | 'fillAndAddForClipping'
      | 'strokeAndAddPathForClipping'
      | 'fillThenStrokeAndAddToPathForClipping'
      | 'addToPathForClipping';
  }

  interface _ImageOptions {
    imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array;
    x: number;
    y: number;
    width: number;
    height: number;
    alias?: string;
    compression?: 'NONE' | 'FAST' | 'MEDIUM' | 'SLOW';
    rotation?: number;
    format?: string;
  }

  interface _PageInfo {
    pageNumber: number;
    pageContext: unknown;
  }

  class jsPDF {
    constructor(options?: jsPDFOptions);

    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
        width: number;
        height: number;
      };
    };

    setFontSize(size: number): this;
    setTextColor(color: string | number, g?: number, b?: number): this;
    text(text: string | string[], x: number, y: number, options?: TextOptionsLight): this;
    addImage(
      imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number,
      alias?: string,
      compression?: 'NONE' | 'FAST' | 'MEDIUM' | 'SLOW',
      rotation?: number
    ): this;
    addPage(format?: string | [number, number], orientation?: 'portrait' | 'landscape'): this;
    setPage(page: number): this;
    getNumberOfPages(): number;
    output(type: 'blob'): Blob;
    output(type: 'arraybuffer'): ArrayBuffer;
    output(type: 'datauristring' | 'dataurlstring'): string;
    output(type: string): unknown;

    // autoTable extension (from jspdf-autotable)
    autoTable?(options: AutoTableOptions): this;
  }

  interface AutoTableOptions {
    startY?: number;
    head?: unknown[][];
    body?: unknown[][];
    foot?: unknown[][];
    styles?: {
      fontSize?: number;
      cellPadding?: number;
      fillColor?: number[];
      textColor?: number[];
      fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    };
    headStyles?: {
      fillColor?: number[];
      textColor?: number[];
      fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    };
    alternateRowStyles?: {
      fillColor?: number[];
    };
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    theme?: 'striped' | 'grid' | 'plain';
  }

  export { jsPDF };
}

declare module 'jspdf-autotable' {
  import type { jsPDF } from 'jspdf';

  interface AutoTableOptions {
    startY?: number;
    head?: unknown[][];
    body?: unknown[][];
    foot?: unknown[][];
    styles?: Record<string, unknown>;
    headStyles?: Record<string, unknown>;
    alternateRowStyles?: Record<string, unknown>;
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
