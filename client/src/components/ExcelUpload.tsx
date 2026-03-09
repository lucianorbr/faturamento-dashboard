import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';

interface ExcelUploadProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
}

export default function ExcelUpload({ onFileSelect, loading }: ExcelUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file?.name);
    if (file && file.name.endsWith('.xlsx')) {
      console.log('Valid file, calling onFileSelect');
      try {
        onFileSelect(file);
      } catch (err) {
        console.error('Error in onFileSelect:', err);
      }
    } else {
      console.warn('Invalid file selected');
    }
    // Reset input para permitir re-upload do mesmo arquivo
    e.target.value = '';
  };

  const handlePasswordSubmit = () => {
    if (password === 'usr25w2k40') {
      setDialogOpen(false);
      setPassword('');
      fileInputRef.current?.click();
    } else {
      alert('Senha incorreta');
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={loading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? 'Carregando...' : 'Upload Excel'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digite a senha para upload</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
              />
            </div>
            <Button onClick={handlePasswordSubmit} className="w-full">
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
