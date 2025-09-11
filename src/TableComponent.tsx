import { useState, useEffect} from "react";
import { Table,TableHeader,TableHead,TableBody,TableCell,TableRow } from "./components/ui/table";
import axios from 'axios';

export interface TableRowData {
  [key: string]: string | number | null;
}

interface ReportRow {
  Dia: string;          
  Hora: string;         
  Nome: string;         
  Form1: number;
  Form2: number;
  values: number[];
}

interface ReportData {
  page: number;
  pageSize: number;
  rows: ReportRow[];
}

export default function TableComponent() {
  const [dados, setDados] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ReportData>(
          "http://192.168.5.128:3000/api/relatorio/"
        );
        setDados(response.data.rows);
      } catch (err) {
        setError("Erro ao carregar relatórios");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-auto">
      <Table cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <TableHeader style={{ background: "#f2f2f2" }}>
          <TableRow className="[&>*]:whitespace-nowrap bg-background sticky top-0 after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
            <TableHead className='text-center'>Dia</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Form1</TableHead>
            <TableHead>Form2</TableHead>
            {dados[0]?.values.map((_, index) => (
              <TableHead key={index}>Value {index + 1}</TableHead>
            ))}

          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.map((row, i) => (
            <TableRow key={i} className="[&>td]:border-r last:border-r-0 text-center odd:bg-red-50 even:bg-white">
              <TableCell className="font-medium h-[10%] px-10">{row.Dia}</TableCell>
              <TableCell>{row.Hora}</TableCell>
              <TableCell>{row.Nome}</TableCell>
              <TableCell>{row.Form1}</TableCell>
              <TableCell>{row.Form2}</TableCell>
              {row.values.map((val, j) => (
                <TableCell key={j}>{val}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
