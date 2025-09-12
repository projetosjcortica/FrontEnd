// hooks/useReportData.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filtros, ReportData, ReportRow } from '../components/types';

export const useReportData = (filtros: Filtros) => {
  const [dados, setDados] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ReportData>(
          "http://192.168.5.128:3000/api/relatorio/",
          {
            params: {
              ...(filtros.dataInicio && { data_inicio: filtros.dataInicio }),
              ...(filtros.dataFim && { data_fim: filtros.dataFim }),
              ...(filtros.nomeFormula && filtros.nomeFormula !== 'todos' && { 
                nome_formula: filtros.nomeFormula 
              }),
            }
          }
        );
        
        setDados(response.data.rows);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar relatórios");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [filtros]);

  return { dados, loading, error };
};