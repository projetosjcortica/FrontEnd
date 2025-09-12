import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFiltros } from "../hooks/useFiltros";
import { Filtros } from "../components/types";

interface FiltrosBarProps {
  onAplicarFiltros?: (filtros: Filtros) => void;
}

export default function FiltrosBar({ onAplicarFiltros }: FiltrosBarProps) {
  const { filtros, handleFiltroChange, limparFiltros } = useFiltros();
  const [filtrosTemporarios, setFiltrosTemporarios] = useState<Filtros>(filtros);

  // Atualiza os filtros temporários quando os inputs mudam
  const handleInputChange = (nome: keyof Filtros, valor: string) => {
    setFiltrosTemporarios(prev => ({
      ...prev,
      [nome]: valor
    }));
  };

  // Aplica os filtros
  const handleAplicar = () => {
    // Atualiza os filtros no hook
    Object.entries(filtrosTemporarios).forEach(([key, value]) => {
      handleFiltroChange(key as keyof Filtros, value);
    });

    // Notifica o componente pai
    if (onAplicarFiltros) {
      onAplicarFiltros(filtrosTemporarios);
    }
  };

  // Limpa todos os filtros
  const handleLimpar = () => {
    const filtrosLimpos = {
      dataInicio: '',
      dataFim: '',
      nomeFormula: ''
    };
    
    setFiltrosTemporarios(filtrosLimpos);
    limparFiltros();
    
    if (onAplicarFiltros) {
      onAplicarFiltros(filtrosLimpos);
    }
  };

  return (
    <div className="flex flex-row items-end justify-end gap-2">
      <Input 
        type="text" 
        placeholder="Filtrar por nome..."
        value={filtrosTemporarios.nomeFormula}
        onChange={(e) => handleInputChange('nomeFormula', e.target.value)}
        className="border-black w-48"
      />
      
      <Input 
        type="date"
        placeholder="Data início"
        value={filtrosTemporarios.dataInicio}
        onChange={(e) => handleInputChange('dataInicio', e.target.value)}
        className="border-black w-40"
      />
      
      <Input 
        type="date"
        placeholder="Data fim"
        value={filtrosTemporarios.dataFim}
        onChange={(e) => handleInputChange('dataFim', e.target.value)}
        className="border-black w-40"
      />
      
      <Button variant='outline'onClick={handleAplicar} className=" text-black">
        Buscar
      </Button>
      
      <Button onClick={handleLimpar} variant="outline">
        Limpar
      </Button>
    </div>
  );
}