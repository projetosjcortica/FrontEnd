// types.ts
export interface ReportRow {
  Dia: string;
  Hora: string;
  Nome: string;
  Form1: number;
  Form2: number;
  values: number[];
}

export interface ReportData {
  page: number;
  pageSize: number;
  rows: ReportRow[];
}

export interface Filtros {
  dataInicio: string;
  dataFim: string;
  nomeFormula: string;
}