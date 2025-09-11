import { useState, useEffect, useRef } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "./components/ui/button"
import Products, { colLabelsBase } from "./products";
import { Input } from "./components/ui/input";
import { SelectSeparator } from "./components/ui/select"
import TableComponent from "./TableComponent";


function Report() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [, setColLabels] = useState<{ [key: string]: string }>(colLabelsBase);
  const[view,setView] = useState('table');

  let content;
    switch (view) {
      case 'table':
        content = <TableComponent/>;
      break;
      case 'product':
        content = <Products />;
      break;
      default:
        content = <h1>404 - Not Found</h1>;
}

  useEffect(() => {
    const savedLabels = localStorage.getItem("colLabels");
    if (savedLabels) {
      setColLabels(JSON.parse(savedLabels));
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('Button clicked!');
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="overflow-hidden flex flex-col gap-2 w-[100vw] h-full">
      <div id="top-container" className="h-30 flex flex-row justify-between">
        <div id="toggle-page" className="flex flex-row items-end">
          <div id="buttons" className="flex flex-row gap-2">
            <Button onClick={()=>setView('table')}>relatórios</Button>
            <Button onClick={()=>setView('product')}>Produtos</Button>
          </div>
          <SelectSeparator/>
        </div>
        <div id="searchBar" className="flex flex-row items-end justify-end">
          <Input type="text" placeholder="Digite sua formula" className="border-black w-100" />
          <Button className="ml-2" onClick={handleClick}>
            <span>Data</span>
          </Button>
          <Button className="ml-2" onClick={handleClick}>
            <span className="tooltip-text">Automático</span>
          </Button>
          <Button className="ml-2" onClick={handleClick}>
            <span className="tooltip-text">Upload</span>
          </Button>
        </div>
      </div>
      <div id="display" className="flex flex-row gap-3.5 flex items-end h-[81vh]">
        <div id="db" className="w-[83vw] mx-auto h-[82.5vh] scroll-smooth scrollbar-custom shadow-xl/16 flex justify-center">
            {content}
        </div>
      </div>
    </div>
  );
}

export default Report;