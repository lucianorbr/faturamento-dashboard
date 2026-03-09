import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface ExcelUploadProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
}

export default function ExcelUpload({ onFileSelect, loading }: ExcelUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      onFileSelect(file);
    } else {
      alert('Por favor, selecione um arquivo .xlsx válido');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
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
      <Button
        onClick={handleClick}
        disabled={loading}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        {loading ? 'Carregando...' : 'Upload Excel'}
      </Button>
    </div>
  );
}
