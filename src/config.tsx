import { toast } from "react-toastify";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";

export const initialFormData = {
  nomeCliente: "",
  ip: "",
  user: "",
  password: "",
  localCSV: "",
  metodoCSV: "", // '1' ou '2'
  habilitarCSV: false,
  serverDB: "",
  database: "",
  userDB: "",
  passwordDB: "",
  mySqlDir: "",
  dumpDir: "",
  batchDumpDir: "",
};

export interface FormData {
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
  mySqlDir: string;
  dumpDir: string;
  batchDumpDir: string;
}

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

type FormDataKey = keyof FormData;



/* ----------------- GERAL ------------------- */

export function GeneralConfig({
  formData,
  isEditing,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: {
  formData: FormData;
  isEditing: boolean;
  onChange: (key: FormDataKey, value: FormData[FormDataKey]) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div id="geral" className="flex flex-col gap-10">
      <Label>
        Nome do cliente
        <Input
          placeholder="Nome do cliente"
          type="text"
          value={formData.nomeCliente || ''}
          onChange={(e) => onChange("nomeCliente", e.target.value)}
          disabled={!isEditing}
        />
      </Label>

      {/* Container MFC agora está no Geral */}
      <div id="containerMFC" className="flex flex-row justify-center items-center h-17 gap-2">
        <div id="CsvMethod" className="w-30 h-17 flex flex-col justify-center items-center border rounded">
          <Label className="mb-1">Método CSV</Label>
          <Label className="mr-0.5">
            Único
            <input
              type="radio"
              value="1"
              checked={formData.metodoCSV === "1"}
              onChange={(e) => onChange("metodoCSV", e.target.value)}
              disabled={!isEditing}
            />
          </Label>
          <Label className="mr-0.5">
            Mensal
            <input
              type="radio"
              value="2"
              checked={formData.metodoCSV === "2"}
              onChange={(e) => onChange("metodoCSV", e.target.value)}
              disabled={!isEditing}
            />
          </Label>
        </div>

        <div id="formule" className="w-30 h-17 flex flex-col justify-center items-center border rounded gap-4">
          <Label>Fórmula</Label>
          <Label>
            habilitar
            <Checkbox
              id="formula"
              checked={formData.habilitarCSV}
              onCheckedChange={(checked) => onChange("habilitarCSV", !!checked)}
              disabled={!isEditing}
            />
          </Label>
        </div>

        <div id="CsvImport" className="w-30 h-17 flex flex-col justify-center items-center border rounded gap-2">
          <Label>importar CSV</Label>
          <Button disabled={!isEditing}>Importar</Button>
        </div>
      </div>

      <div id="footer" className="gap-2">
        {isEditing ? (
          <>
            <Button id="cancel" className="mr-4" onClick={onCancel}>
              Cancelar
            </Button>
            <Button id="save" onClick={onSave}>
              Salvar
            </Button>
          </>
        ) : (
          <Button id="edit" onClick={onEdit}>
            Editar
          </Button>
        )}
      </div>
    </div>
  );
}

/* ----------------- IHM ------------------- */
export function IHMConfig({
  formData,
  isEditing,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: {
  formData: FormData;
  isEditing: boolean;
  onChange: (key: FormDataKey, value: FormData[FormDataKey]) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div id="webCfg" className="flex flex-col gap-4">
      <Label>
        IP da IHM
        <Input
          type="text"
          value={formData.ip}
          onChange={(e) => onChange("ip", e.target.value)}
          disabled={!isEditing}
        />
      </Label>
      <Label>
        Usuário
        <Input
          type="text"
          value={formData.user}
          onChange={(e) => onChange("user", e.target.value)}
          disabled={!isEditing}
        />
      </Label>
      <Label>
        Senha
        <Input
          type="text"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
          disabled={!isEditing}
        />
      </Label>
      <Label>
        Upload CSV
        <Input type="text" value={formData.localCSV} readOnly disabled />
        <Button
          onClick={async () => {
            const path = await window.electronAPI.selectFolder();
            if (path) onChange("localCSV", path);
          }}
          disabled={!isEditing}
        >
          selecionar arquivo
        </Button>
      </Label>
      <div id="footer" className="gap-2">
        {isEditing ? (
          <>
            <Button id="cancel" className="mr-4" onClick={onCancel}>
              Cancelar
            </Button>
            <Button id="save" onClick={onSave}>
              Salvar
            </Button>
          </>
        ) : (
          <Button id="edit" onClick={onEdit}>
            Editar
          </Button>
        )}
      </div>
    </div>
  );
}

/* ----------------- BANCO DE DADOS ------------------- */
export function DatabaseConfig({
formData,
  isEditing,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: {
  formData: FormData;
  isEditing: boolean;
  onChange: (key: FormDataKey, value: FormData[FormDataKey]) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div id="dbCfg" className="flex flex-col gap-4">
      <Label>
        Server
        <Input
          type="text"
          value={formData.serverDB}
          onChange={(e) => onChange("serverDB", e.target.value)}
          disabled={!isEditing}
        />
      </Label>
      <Label>
        DataBase
        <Input
          type="text"
          value={formData.database}
          onChange={(e) => onChange("database", e.target.value)}
          disabled={!isEditing}
        />
      </Label>
      <Label>
        User
        <Input
          type="text"
          value={formData.userDB}
          onChange={(e) => onChange("userDB", e.target.value)}
          disabled={!isEditing}
        />
      </Label>
      <Label>
        Senha
        <Input
          type="text"
          value={formData.passwordDB}
          onChange={(e) => onChange("passwordDB", e.target.value)}
          disabled={!isEditing}
        />
      </Label>
     <div id="footer" className="flex gap-4">
        {isEditing ? (
          <>
            <Button id="cancel" className="mr-4" onClick={onCancel}>
              Cancelar
            </Button>
            <Button id="save" onClick={onSave}>
              Salvar
            </Button>
          </>
        ) : (
          <Button id="edit" onClick={onEdit}>
            Editar
          </Button>
        )}
      </div>
    </div>
  );
}

/* ----------------- ADMIN ------------------- */
export function AdminConfig({
formData,
  isEditing,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: {
  formData: FormData;
  isEditing: boolean;
  onChange: (key: FormDataKey, value: FormData[FormDataKey]) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div id="adm" className="flex flex-col gap-4">

      <div id="CfgAdvancedDB" className="my-7">
        <div className="dir flex flex-col gap-5">
          <div className="flex-col">
            <Label>Local do SQL</Label>
            <div className="flex flex-row">
              <Input type="text" value={formData.mySqlDir} readOnly disabled />
              <Button
                type="button"
                onClick={async () => {
                  const path = await window.electronAPI.selectFile();
                  if (path) onChange("mySqlDir", path);
                }}
                disabled={!isEditing}
              >
                selecionar arquivo
              </Button>
            </div>
          </div>

          <div className="flex-col">
            <Label>Local do DUMP</Label>
            <div className="flex flex-row">
              <Input type="text" value={formData.dumpDir} readOnly disabled />
              <Button
                type="button"
                onClick={async () => {
                  const path = await window.electronAPI.selectFile();
                  if (path) onChange("dumpDir", path);
                }}
                disabled={!isEditing}
              >
                selecionar arquivo
              </Button>
            </div>
          </div>

          <div className="flex-col">
            <Label>Local do BATCH</Label>
            <div className="flex flex-row">
              <Input type="text" value={formData.batchDumpDir} readOnly disabled />
              <Button
                type="button"
                onClick={async () => {
                  const path = await window.electronAPI.selectFile();
                  if (path) onChange("batchDumpDir", path);
                }}
                disabled={!isEditing}
              >
                selecionar arquivo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div id="CmdAdvancedDB" className="mb-7">
        <div id="sidetxt" className="m-0.5">
          <Label>
            Importar dump padrão
            <Button className="w-30" disabled={!isEditing}>
              Importar Dump
            </Button>
          </Label>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div id="sidetxt" className="m-0.5">
              <Label>
                Zerar banco de Dados
                <Button className="w-25" disabled={!isEditing}>
                  Zerar banco
                </Button>
              </Label>
            </div>
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
                      toast.success("Banco de dados zerado com sucesso!");
                    } else {
                      toast.error("Erro ao zerar banco de dados");
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error("Ocorreu um erro inesperado");
                  }
                }}
              >
                continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div id="footer" className="gap-2">
        {isEditing ? (
          <>
            <Button id="cancel" className="mr-4" onClick={onCancel}>
              Cancelar
            </Button>
            <Button id="save" onClick={onSave}>
              Salvar
            </Button>
          </>
        ) : (
          <Button id="edit" onClick={onEdit}>
            Editar
          </Button>
        )}
      </div>
    </div>
  );
}
