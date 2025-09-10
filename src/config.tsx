import { useState, useEffect } from "react";
import {toast } from 'react-toastify';
import { Label } from './components/ui/label';
import { Input }from './components/ui/input';
import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogAction,AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "./components/ui/alert-dialog";

declare global {
  interface Window {
    electronAPI: {
      loadData: (key: string) => Promise<typeof initialFormData>;
      saveData: (key: string, data: typeof initialFormData) => Promise<boolean>;
      selectFolder: () => Promise<string>;
      selectFile: () => Promise<string>;
      cleanDB: () => Promise<boolean>;
    };
  }
}




export const initialFormData = {
  nomeCliente: '',
  ip: '',
  user: '',
  password: '',
  localCSV: '',
  metodoCSV: '',  // '1' ou '2'
  habilitarCSV: false,
  serverDB: '',
  database: '',
  userDB: '',
  passwordDB: '',
  passwordADM: '',
  mySqlDir: '',
  dumpDir: '',
  batchDumpDir: '',
};

function Cfg() {
  
const [formData, setFormData] = useState(initialFormData);
const [isEditing, setIsEditing] = useState(false);
const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
const [originalData, setOriginalData] = useState(initialFormData);


useEffect(() => {
  window.electronAPI.loadData('formData').then((data) => {
    if (data && typeof data === 'object') {
      
      const updatedData = { ...initialFormData, ...data };
      setFormData(updatedData);
      setOriginalData(updatedData);
    }
  });
}, []);

  interface FormData {
    nomeCliente: string;
    ip: string;
    user: string;
    password: string;
    localCSV: string;
    metodoCSV: string;
    habilitarCSV: boolean;
    serverDB: string;
    database: string;
    userDB: string;
    passwordDB: string;
    passwordADM: string;
    mySqlDir: string;
    dumpDir: string;
    batchDumpDir: string;
  }

  type FormDataKey = keyof FormData;

  const handleChange = (key: FormDataKey, value: FormData[FormDataKey]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

const handleSave = async () => {

  const result = await window.electronAPI.saveData('formData', formData);
  if (result) {
    toast.success('Dados salvos com sucesso!');
    setIsEditing(false);
  } else {
    toast.error('Erro ao salvar dados.');
  }
};

  const handleEdit = () => {
  setIsEditing(true); 
  };

  const handleCancel = () => {
  setFormData(originalData); 
  setIsEditing(false);
  };

  const handleAdminAuth = () => {
  if (formData.passwordADM === rightAdmPassword) {
    setIsAdminAuthenticated(true);
    toast.success('Acesso de administrador liberado!');
  } else {
    toast.error('Senha de administrador incorreta!');
  }
};

  const rightAdmPassword = 'admin123'
    return(
        <div id="cfgContent" className=" w-full flex justify-center items-center">
            <div id='layoutCfg' className="flex flex-row-reverse gap-10">
                <div id="geral" className="flex flex-col border rounded p-5 h-[43em] w-[29em] gap-4 shadow-xl/20">
                    <h2>GERAL</h2>
                    <Label>Nome do cliente<Input placeholder='Nome do cliente'type="text" name="nomeCliente"  value={formData.nomeCliente || ''} onChange={(e) => handleChange("nomeCliente", e.target.value)}  disabled={!isAdminAuthenticated || !isEditing}/></Label>        
                    <p>Configurações de rede</p>
                    <div id='webCfg' className="gap-2" >
                            <div><Label>Ip da IHM<Input        className='m-0.5'   type="text"   value={formData.ip || ''} onChange={(e) => handleChange("ip", e.target.value)}  disabled={!isAdminAuthenticated || !isEditing} name="IP"/></Label></div>        
                            <div><Label>Usuário<Input          className='m-0.5'   type="text"   value={formData.user || ''} onChange={(e) => handleChange("user", e.target.value)}  disabled={!isAdminAuthenticated || !isEditing} name="user"/></Label></div>        
                            <div><Label>Senha <Input           className='m-0.5'   type="text"   value={formData.password || ''} onChange={(e) => handleChange("password", e.target.value)}  disabled={!isAdminAuthenticated || !isEditing} name="password"/></Label></div>        
                            <div><Label>Local do CSV<Input     className='m-0.5'   type="text"   value={formData.localCSV || ''} readOnly disabled={!isAdminAuthenticated || !isEditing} name="localCSV"/><Button className="w-34" onClick={async()=> {const path = await window.electronAPI.selectFolder();if (path){console.log("caminho: ",path);handleChange("localCSV",path);}}} disabled={!isAdminAuthenticated || !isEditing}>selecionar arquivo</Button></Label></div>   
                    </div>
                    <div id='containerMFC' className="flex flex-row justify-center items-center h-17 gap-2">
                              <div id="CsvMethod" className="w-30 h-17 flex flex-col justify-center items-center border rounded">
                                <Label className="mb-1">Método CSV</Label>  
                                  <Label className=" mr-0.5">Único<input type='radio'id="1" name='selector'value='1' checked={formData.metodoCSV === '1'} onChange={(e) => handleChange('metodoCSV', e.target.value)} disabled={!isAdminAuthenticated || !isEditing}/></Label>
                                  <Label className=" mr-0.5">Mensal<input type='radio'id="2" name='selector'value='2' checked={formData.metodoCSV === '2'} onChange={(e) => handleChange('metodoCSV', e.target.value)} disabled={!isAdminAuthenticated || !isEditing} /></Label>
                              </div>
                              <div id='formule' className="w-30 h-17 flex flex-col justify-center items-center border rounded gap-4">
                                <Label>Fórmula </Label>     
                                  <Label>habilitar<Checkbox id="formula" checked={formData.habilitarCSV} onCheckedChange={(checked) => handleChange('habilitarCSV', checked)} disabled={!isAdminAuthenticated || !isEditing} /></Label>
                                
                              </div>  
                              <div id='CsvImport' className="w-30 h-17 flex flex-col justify-center items-center border rounded gap-2">
                                  <Label>importar CSV</Label>
                                  <Button onClick={() => {}} disabled={!isAdminAuthenticated || !isEditing}>Importar</Button>
                              </div>
                    </div>
                    <p>Configurações do Banco de Dados</p>
                    <div id='dbCfg'>
                       <div> <Label>Server<Input className="m-0.5" placeholder=''type="text" value={formData.serverDB || ''} onChange={(e) => handleChange("serverDB", e.target.value)} disabled={!isAdminAuthenticated || !isEditing} name="server"/></Label></div>        
                       <div> <Label>DataBase<Input className="m-0.5" placeholder=''type="text"   value={formData.database || ''} onChange={(e) => handleChange("database", e.target.value)}  disabled={!isAdminAuthenticated || !isEditing} name="port"/></Label></div>        
                       <div> <Label>User<Input className="m-0.5" placeholder=''type="text"   value={formData.userDB || ''} onChange={(e) => handleChange("userDB", e.target.value)}  disabled={!isAdminAuthenticated || !isEditing} name="user"/></Label></div>        
                       <div> <Label>Senha<Input className="m-0.5" placeholder=''type="text"  value={formData.passwordDB || ''} onChange={(e) => handleChange("passwordDB", e.target.value)}  disabled={!isAdminAuthenticated || !isEditing} name="password"/></Label></div>        
                    </div>
                    <div id="footer" className="gap-2">
                        {isEditing ? (
                        
                          <>
                          <Button  id="cancel" className='mr-4' onClick={handleCancel}>Cancelar</Button>
                          <Button  id="save" onClick={handleSave}>Salvar</Button>
                          </>
                        ) : (
                            <Button  id="edit" onClick={handleEdit} disabled={!isAdminAuthenticated}>Editar</Button>
                        )}
                    </div>
                </div>
                
        <div id='adm' className="border rounded p-5 w-[29em] gap-4 shadow-xl/10">
          <h2>ADMINISTRADOR</h2>

              <Input
                placeholder='insira senha para continuar'
                type='text'
                value={formData.passwordADM || ''}
                onChange={(e) => handleChange("passwordADM", e.target.value)}
                name="passwordADM"
                className="m-1.5"
              />
              <Button className="m-1.5" type="button" onClick={handleAdminAuth} disabled={isAdminAuthenticated} >
                Entrar
              </Button>

              <div id='CfgAdvancedDB' className="my-7">
                <div className="dir">
                  <div className="flex-col"><Label>Local do SQL</Label><div className="flex flex-row"><Input className="m-4" type="text" value={formData.mySqlDir || ''} readOnly disabled={!isAdminAuthenticated || !isEditing} name="mySqlDir"/><Button type="button" className="w-33 m-4" onClick={async()=> {const path = await window.electronAPI.selectFile();if (path){console.log("caminho: ",path);handleChange("mySqlDir",path);}}} disabled={!isAdminAuthenticated || !isEditing}>selecionar arquivo</Button></div></div>
                  <div className="flex-col"><Label>Local do DUMP</Label><div className="flex flex-row"><Input className="m-4" type="text" value={formData.dumpDir || ''} readOnly disabled={!isAdminAuthenticated || !isEditing} name="dumpDir"/><Button type="button" className="w-34 m-4" onClick={async()=> {const path = await window.electronAPI.selectFile();if (path){console.log("caminho: ",path);handleChange("dumpDir",path);}}} disabled={!isAdminAuthenticated || !isEditing}>selecionar arquivo</Button></div></div>
                  <div className="flex-col"><Label>Local do BATCH</Label><div className="flex flex-row"><Input className="m-4" type="text" value={formData.batchDumpDir || ''} readOnly disabled={!isAdminAuthenticated || !isEditing} name="batchDumpDir"/><Button type="button" className="w-34 m-4" onClick={async()=> {const path = await window.electronAPI.selectFile();if (path){console.log("caminho: ",path);handleChange("batchDumpDir",path);}}} disabled={!isAdminAuthenticated || !isEditing}>selecionar arquivo</Button></div></div>
                </div>
              </div>
              <div id='CmdAdvancedDB' className='mb-7'>    
                <div id='sidetxt' className="m-0.5"><Label>Importar dump padrão<Button className='w-30' id="ImportDump" disabled={!isAdminAuthenticated || !isEditing}>Importar Dump</Button></Label></div> 
                <AlertDialog>
                  <AlertDialogTrigger asChild> 
                    <div id='sidetxt' className="m-0.5"><Label>Zerar banco de Dados<Button className='w-25' id="cleanDB" disabled={!isAdminAuthenticated || !isEditing} > Zerar banco</Button></Label></div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Todos os dados do banco serão permanentemenete deletados
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            const sucesso = await window.electronAPI.cleanDB();
                            if (sucesso) {
                              toast.success('Banco de dados zerado com sucesso!');
                            } else {
                              toast.error('Erro ao zerar banco de dados');
                            }
                          } catch (err) {
                            console.error(err);
                            toast.error('Ocorreu um erro inesperado');
                          }
                        }}
                      >
                        continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
        </div>
    </div>
  </div>  
)

}

export default Cfg;