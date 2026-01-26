// Type declarations for optional xlsx (SheetJS) library
// This allows the project to compile even without xlsx installed

declare module 'xlsx' {
  interface WorkBook {
    SheetNames: string[];
    Sheets: { [key: string]: unknown };
  }

  interface AOA2SheetOpts {
    dateNF?: string;
    cellDates?: boolean;
    sheetStubs?: boolean;
  }

  interface WritingOptions {
    bookType?:
      | 'xlsx'
      | 'xlsm'
      | 'xlsb'
      | 'xls'
      | 'biff8'
      | 'biff5'
      | 'biff2'
      | 'xlml'
      | 'ods'
      | 'fods'
      | 'csv'
      | 'txt'
      | 'sylk'
      | 'html'
      | 'dif'
      | 'rtf'
      | 'prn'
      | 'eth';
    type: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string';
  }

  interface Utils {
    book_new(): WorkBook;
    aoa_to_sheet(data: unknown[][], opts?: AOA2SheetOpts): unknown;
    book_append_sheet(workbook: WorkBook, worksheet: unknown, name: string): void;
  }

  export const utils: Utils;
  export function write(workbook: WorkBook, opts: WritingOptions): ArrayBuffer | string;
  export function writeFile(workbook: WorkBook, filename: string, opts?: WritingOptions): void;
}
