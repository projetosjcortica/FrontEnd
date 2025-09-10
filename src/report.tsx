import { useState, useEffect, useRef } from "react";
// import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "./components/ui/button";
import { Table, TableCell, TableHead, TableHeader, TableBody, TableRow } from "./components/ui/table";
import { colLabelsBase } from "./products"
import { Separator } from "./components/ui/separator";
// import { Pie, PieChart } from "recharts"
// import { ChartContainer,  ChartTooltip,  ChartTooltipContent } from '@/components/ui/chart'

function Report() {
  const [data, setData] = useState<TableRowData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [, setColLabels] = useState<{ [key: string]: string }>(colLabelsBase);

  useEffect(() => {
    const savedLabels = localStorage.getItem("colLabels");
    if (savedLabels) {
      setColLabels(JSON.parse(savedLabels));
    }
  }, []);

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Example: prevent default form submission
    console.log('Button clicked!');
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/data');
      if (!response.ok) throw new Error('Falha ao buscar dados');
      const json: TableRowData[] = await response.json();
      setData(json);
      setColumns(json.length > 0 ? Object.keys(json[0]) : [])
    } catch (err: unknown) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  
  return (
    <>
        <div className="overflow-hidden flex flex-row gap-2 w-[100vw]">
            <div id="db" className="w-[60vw] mx-auto h-[90vh] rounded scroll-smooth scrollbar-custom">
              {loading && <p>Carregando dados...</p>}
              {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
              <TableComponent data={data} columns={columns}/>
            </div>
          <div id="options"className="w-[20vw] flex flex-col justify-start items-center h-[90vh] border rounded ">
              <div id="buttoms" className="flex flex-row gap-1 h-20">
                  
                  <Button 
                    className={`mt-5.5`}
                    onClick={handleClick}>
                    
                    <span>Filtro</span>
                  </Button>
                    
                  <Button
                    className={`mt-5.5 transition-colors `}
                    onClick={handleClick}
                  >
                    <span className="tooltip-text">Automático</span>
                    </Button>
                
                  <Button 
                    className="mt-5.5" onClick={handleClick}>
                    
                    <span className="tooltip-text">Upload</span>
                  </Button>

              </div>
              <div id="showData" className="w-[90%] h-[86.5%] flex flex-col justify-start">
                <div id="displaySquaree" className="w-[100%] h-[26.5%] grid grid-cols-2 gap-3 ">  
                  <div id="TotalProduced" className="border-2 rounded-lg max-h-[95.16px] w-[100%] h-[100%] flex flex-col justify-start text-center">
                    <p className="subpixel-antialiased font-semibold m-3">Total Produzido</p>
                    {/* {(() => {
                    if (!range?.from) {
                      return null;
                    }

                        // Total Produzido
                        let totalProduzido = 0;
                        linhasFiltradas.forEach((row) => {
                          columns.forEach((col, idx) => {
                            if (idx >= 5) totalProduzido += Number(row[col]) || 0;
                          });
                        });

                    return (
                      <>
                        <span className="text-2xl font-bold text-primary">
                          {totalProduzido}
                        </span>
                      </>
                    );
                  })()} */}
                </div>
                  <div id="TotalBeat" className="border-2 rounded-lg max-h-[95.16px] w-[100%] h-[100%] flex flex-col justify-start text-center">
                    <p className="subpixel-antialiased font-semibold m-3">Batidas</p>
                    {/* {(() => {
                      if (!range?.from) return null;

                      const totalBatidas = linhasFiltradas.length;

                      return (
                        <span className="text-2xl font-bold text-primary">
                          {linhasFiltradas.length}
                        </span>
                      );
                    })()} */}
                  </div>
                  <div id="StartHour" className="border-2 rounded-lg w-[100%] h-[100%] flex flex-row justify-center ">
                    <p className="subpixel-antialiased font-semibold m-3">hora de inicio</p>
                  </div>
                  <div id="EndHour" className="border-2 rounded-lg w-[100%] h-[100%] flex flex-row justify-center ">
                    <p className="subpixel-antialiased font-semibold m-3">hora final</p>
                  </div>
                </div>  
                <Separator className="mt-3 border-1" />
                <div
                  id="TotalProducts"
                  className="mt-3 w-full h-50 bg-background sticky top-0 border rounded-2xl shadow-md overflow-auto scrollbar-custom"
                >
                  <Table className="w-full text-sm">
                    <TableHeader className="bg-muted/50">
                      <TableRow className="[&>*]:whitespace-nowrap bg-background sticky top-0 after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
                        <TableHead className="text-center font-semibold">Ingrediente</TableHead>
                        <TableHead className="text-center font-semibold">Quantidade Total</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {/* {(() => {
                        const linhasFiltradas = getFilteredRows(data, columns, range, selectedFormula);
                        const totais = {};
                        linhasFiltradas.forEach((row) => {
                          columns.forEach((col, idx) => {
                            if (idx >= 5) {
                              const valor = Number(row[col]) || 0;
                              totais[col] = (totais[col] || 0) + valor;
                            }
                          });
                        });
                        const totaisFiltrados = Object.entries(totais).filter(([_, total]) => total > 0);

                        if (totaisFiltrados.length === 0) {
                          return (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center italic">
                                Nenhum dado disponível para este período
                              </TableCell>
                            </TableRow>
                          );
                        }

                        return totaisFiltrados.map(([colKey, total], idx) => (
                          <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="text-center">{colLabels[colKey] || colKey}</TableCell>
                            <TableCell className="text-center font-bold">{total}</TableCell>
                          </TableRow>
                        ));
                      })()} */}
                    </TableBody>
                  </Table>
                  {/* <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie data={chartData} dataKey="visitors" nameKey="browser" />
                    </PieChart>
                  </ChartContainer> */}
                </div>
                <div id='exportBtns' className="flex flex-col justify-center items-center gap-1">
                  <h2>Gerar Relatorio</h2>  
                  <div className="gap-2 justify-center items-center">
                    <Button id="pdf">pdf</Button>
                    <Button id="excel">excel</Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </>
  );
}

interface TableRowData {
  [key: string]: string | number | null;
}

interface TableComponentProps {
  data: TableRowData[];
  columns: string[];
}

function TableComponent({ data, columns }: TableComponentProps) {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [lastSelected, setLastSelected] = useState<[number, number] | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [colLabels, setColLabels] = useState<{ [key: string]: string }>(colLabelsBase)

  useEffect(() => {
  const savedLabels = localStorage.getItem("colLabels");
  if (savedLabels) {
    setColLabels(JSON.parse(savedLabels));
  }
}, []);

// Gera chave única para cada célula
const cellKey = (row: number, col: number) => `${row},${col}`;

// Evento de clique na célula
function handleCellClick(
  rowIdx: number,
  colIdx: number,
  e: React.MouseEvent<HTMLTableCellElement>
): void {
  if (e.ctrlKey || e.metaKey) {
    // Toggle célula no set
    const key = cellKey(rowIdx, colIdx);
    setSelectedCells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
    setLastSelected([rowIdx, colIdx]);
  } else if (e.shiftKey && lastSelected) {
    // Seleciona bloco entre lastSelected e a célula clicada
    const [lastRow, lastCol] = lastSelected;
    const rowStart = Math.min(lastRow, rowIdx);
    const rowEnd = Math.max(lastRow, rowIdx);
    const colStart = Math.min(lastCol, colIdx);
    const colEnd = Math.max(lastCol, colIdx);

    const newSet = new Set(selectedCells);
    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        newSet.add(cellKey(r, c));
      }
    }
    setSelectedCells(newSet);
  } else {
    // Seleção simples: limpa e seleciona só essa célula
    setSelectedCells(new Set([cellKey(rowIdx, colIdx)]));
    setLastSelected([rowIdx, colIdx]);
  }
}

  useEffect(() => {
  function handleCopy(e: ClipboardEvent) {
    if (selectedCells.size === 0) return;
    e.preventDefault();

    if (!e.clipboardData) return; // segurança

    // Descobrir quais linhas e colunas estão selecionadas
    const coords = Array.from(selectedCells).map((key) =>
      key.split(",").map(Number)
    );
    const rows = coords.map(([r]) => r);
    const cols = coords.map(([, c]) => c);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);

    let text = "";

    for (let r = minRow; r <= maxRow; r++) {
      const rowText: string[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        if (selectedCells.has(cellKey(r, c))) {
          rowText.push(String(data[r][columns[c]] ?? ""));
        } else {
          rowText.push("");
        }
      }
      text += rowText.join("\t") + "\n";
    }

    e.clipboardData.setData("text/plain", text);
  }

  document.addEventListener("copy", handleCopy);
  return () => document.removeEventListener("copy", handleCopy);
}, [selectedCells, data, columns]);

  useEffect(() => {
    function handleClickOutside(event:MouseEvent) {
      if (
      tableRef.current &&
      event.target instanceof Node &&
      !tableRef.current.contains(event.target)
    ) {
      setSelectedCells(new Set());
      setLastSelected(null);
    }
  }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Função que converte "HH:MM" ou "HH:MM:SS" em segundos
  // function timeToSeconds(timeStr) {
  //   if (!timeStr) return 0;
  //   const parts = timeStr.split(":").map(Number);
  //   if (parts.length < 2 || parts.length > 3) return 0; // espera HH:mm ou HH:mm:ss
  //   const [hours, minutes, seconds = 0] = parts;
  //   if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return 0;
  //   return hours * 3600 + minutes * 60 + seconds;
  // }

  // Aplica todos os filtros
//   const filteredData = data.filter((row) => {
//     const passesTextFilters = Object.entries(filters).every(([col, filterValue]) => {
//       if (!filterValue) return true;
//       const cellValue = row[col] ? String(row[col]).toLowerCase() : "";
//       const filterText = filterValue.toLowerCase();
//       return cellValue.includes(filterText);
//     });

//     const passesFormulaFilter =
//     selectedFormula && selectedFormula !== "all"
//       ? row.col3 === selectedFormula
//       : true;

//   const passesDateFilter = (() => {
//   if (!range?.from || !range?.to) return true;

//   const dateStr = row.col1; // <-- ajuste aqui conforme o nome da coluna
//   const rowDate = parseDateString(dateStr);

//   console.log({
//   original: row.col1,
//   parsed: parseDateString(row.col1),
//   range
// })

//   if (!rowDate) return false;

//   const from = new Date(range.from);
//   const to = new Date(range.to);
//   from.setHours(0, 0, 0, 0);
//   to.setHours(23, 59, 59, 999);

//   return rowDate >= from && rowDate <= to;
// })();

//   return passesTextFilters && passesFormulaFilter && passesDateFilter;
// });
//   // Ordena os dados filtrados
//   const sortedData = [...filteredData];

// if (sortConfig.length > 0) {
//   sortedData.sort((a, b) => {
//     for (const { key, direction } of sortConfig) {
//       const aVal = a[key];
//       const bVal = b[key];

//       let compare = 0;

//       if (key === "col2") {
        // Se for coluna de tempo (exemplo)
      //   compare = timeToSeconds(aVal) - timeToSeconds(bVal);
      // } else {
      //   const aNum = parseFloat(aVal);
      //   const bNum = parseFloat(bVal);
      //   if (!isNaN(aNum) && !isNaN(bNum)) {
      //     compare = aNum - bNum;
      //   } else {
      //     compare = String(aVal).localeCompare(String(bVal));
      //   }
      // }

      // if (compare !== 0) {
      //   return direction === "asc" ? compare : -compare;
      // }
      // Se igual, continua para a próxima coluna na lista
    // }
    // return 0; // totalmente igual em todas as colunas ordenadas
//   });
// }
  // Exemplo de função para trocar a ordenação (você pode adaptar)
  // function handleSort(columnKey) {
  // setSortConfig((prevSortConfig) => {
    // Verifica se a coluna já está na lista
    // const existingIndex = prevSortConfig.findIndex(s => s.key === columnKey);

    // if (existingIndex === -1) {
      // Não está no array: adiciona no começo como ascendente
    //   return [{ key: columnKey, direction: "asc" }, ...prevSortConfig];
    // }

    // const existingSort = prevSortConfig[existingIndex];
    // let newDirection;

    // if (existingSort.direction === "asc") {
    //   newDirection = "desc";
    // } else if (existingSort.direction === "desc") {
      // Remove a coluna da ordenação (terceiro clique)
    //   const newSortConfig = [...prevSortConfig];
    //   newSortConfig.splice(existingIndex, 1);
    //   return newSortConfig;
    // }

    // Atualiza a direção da coluna no array mantendo a ordem
//     const newSortConfig = [...prevSortConfig];
//     newSortConfig[existingIndex] = { key: columnKey, direction: newDirection };
//     return newSortConfig;
//   });
// }

  if (!data.length) return <p>Nenhum dado para mostrar</p>;
  

    return (
    <div id="table-container" className=" overflow-auto [&>div]:max-h-[90vh] [&>div]:rounded-sm [&>div]:border "ref={tableRef} style={{ userSelect: "none" }}>
      <Table className="p-[10px] border rounded" style={{ borderCollapse: "collapse" }}>
        <TableHeader>
          <TableRow className="[&>*]:whitespace-nowrap bg-background sticky top-0 after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
            {columns.map((col) => {
              // const sortEntry = sortConfig.find(s => s.key === col);
              return (
                <TableHead
                  className='text-center'
                  key={col}
                  // onClick={() => handleSort(col)}
                  style={{ cursor: "pointer", userSelect: "text" }}
                >
                  {colLabels[col] || col}
                  {/* {sortEntry && (sortEntry.direction === "asc" ? " ↑" : " ↓")} */}
                  {/* Pode mostrar a prioridade também */}
                  {/* {sortEntry && <sup>{sortConfig.indexOf(sortEntry) + 1}</sup>} */}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((row, rIdx) => (
              <TableRow
                key={rIdx}
                className="[&>td]:border-r last:border-r-0 text-center odd:bg-red-50 even:bg-white"
              >
                {columns.map((col, cIdx) => {
                  const isSelected = selectedCells.has(cellKey(rIdx, cIdx));
                  return (
                    <TableCell
                      className="font-medium h-[10%] px-10"
                      key={col}
                      onClick={(e) => handleCellClick(rIdx, cIdx, e)}
                      style={{
                        minWidth: "80px",
                        cursor: "pointer",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        backgroundColor: isSelected ? "#ff2626c9" : undefined,
                      }}
                    >
                      {row[col]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
      </Table>
    </div>
  );
}

export default Report;