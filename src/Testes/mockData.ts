// mocks/mockData.ts
import { ReportRow } from "../components/types";

export const mockRows: ReportRow[] = [
  {
    Dia: "2025-09-10",
    Hora: "08:30:01s",
    Nome: "Relatório A",
    Form1: 1,
    Form2: 2,
    values: [12, 45, 78]
  },
  {
    Dia: "2025-09-11",
    Hora: "14:20:01",
    Nome: "Relatório B",
    Form1: 1,
    Form2: 2,
    values: [33, 56, 90]
  },
  {
    Dia: "2025-09-12",
    Hora: "17:10:01",
    Nome: "Relatório C",
    Form1: 1,
    Form2: 2,
    values: [44, 88, 22]
  }
];
