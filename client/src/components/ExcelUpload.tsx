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
