import { useState, useEffect } from "react";
import { Input } from "./components/ui/input";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Label } from "./components/ui/label";


export type ColLabels = Record<string, string>;
export const colLabelsBase = {
        col1: "Data",
        col2: "Horario",
        col3: "Nome fórmula",
        col4: "Código Programa",
        col5: "Código Fórmula",
        col6: "",
        col7: "",
        col8: "",
        col9: "",
        col10:"",
        col11:"",
        col12:"",
        col13:"",
        col14:"",
        col15:"",
        col16:"",
        col17:"",
        col18:"",
        col19:"",
        col20:"",
        col21:"",
        col22:"",
        col23:"",
        col24:"",
        col25:"",
        col26:"",
        col27:"",
        col28:"",
        col29:"",
        col30:"",
        col31:"",
        col32:"",
        col33:"",
        col34:"",
        col35:"",
        col36:"",
        col37:"",
        col38:"",
        col39:"",
        col40:"",
        col41:"",
        col42:"",
        col43:"",
        col44:"",
        col45:"",
        col46:"",
        col47:"",
        col48:"",
        col49:"",
        col50:"",
        col51:"",
        col52:"",
        col53:"",
        col54:"",
        col55:""
}
function Products() {
  const storageKey = "colLabels";

  const [colLabels, setColLabels] = useState<ColLabels>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : colLabelsBase;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(colLabels));
  }, [colLabels]);

  const handleLabelChange = (colKey: string, value: string) => {
    setColLabels(prev => ({
      ...prev,
      [colKey]: value,
    }));
  };

  // Ordena as chaves para exibir em ordem natural
  const columns = Object.keys(colLabels).sort((a, b) =>
    parseInt(a.replace("col", ""), 10) - parseInt(b.replace("col", ""), 10)
  );

  const editableColumns = columns.filter(col => {
    const colNumber = parseInt(col.replace("col", ""), 10);
    return colNumber > 5;
  });


    return (
        <div id="display" className="w-[60vw] h-[95vh] m-3">
            <h2 className="text-3xl">Editar nome dos Produtos</h2>
            <div className="border rounded p-3 grid grid-cols-2 gap-4 shadow-xl/20">
            {editableColumns.map(col => (
                <div key={col}>
                <div className="flex flex-row justify-center items-center gap-1 border border-black rounded pr-1">
                  <Input className='m-0.5 h-8 inset-shadow-1'  type="text" placeholder={col} id={col} value={colLabels[col]}  onChange={e => handleLabelChange(col, e.target.value)}/>
                  <div>
                    <RadioGroup className="flex flex-row gap-1">
                      <div className="flex flex-row">
                        <RadioGroupItem value="gram" className="border-black mx-1"/>
                        <Label>g</Label>
                      </div>
                      <div className="flex flex-row">
                        <RadioGroupItem value="kilogram" className="border-black mx-1"/>
                        <Label>kg</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                </div>
            ))}
            </div>
        </div>
    );
}
export default Products