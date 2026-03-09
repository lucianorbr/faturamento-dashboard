import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useExcelData } from '@/hooks/useExcelData';
import ExcelUpload from '@/components/ExcelUpload';
import DashboardTabs from '@/components/DashboardTabs';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { data, loading, error, processExcelFile } = useExcelData();
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    console.log('Dashboard mounted');
    // Tentar carregar o arquivo de exemplo automaticamente
    loadSampleFile();
  }, []);

  const loadSampleFile = async () => {
    try {
      console.log('Tentando carregar arquivo de exemplo...');
      const response = await fetch('/sample.xlsx');
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], 'sample.xlsx', { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        console.log('Arquivo de exemplo carregado, processando...');
        processExcelFile(file);
      }
    } catch (err) {
      console.log('Não foi possível carregar arquivo de exemplo:', err);
    }
  };

  useEffect(() => {
    if (error) {
      console.error('Dashboard error:', error);
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (data.envioDiario.length > 0) {
      console.log('Data loaded:', {
        envioDiario: data.envioDiario.length,
        nrcpDiario: data.nrcpDiario.length,
      });
      setHasData(true);
      toast.success('Arquivo carregado com sucesso!');
    }
  }, [data]);

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name);
    processExcelFile(file);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Faturamento Peças Vans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ExcelUpload onFileSelect={handleFileSelect} loading={loading} />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted-foreground mt-4">Carregando dados...</p>
          </div>
        )}

        {!hasData && !error && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m0 0h6m0 0v6m0 0v6m0-6h-6m0 0h-6m0 0v-6m0 0v-6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo ao Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Carregue um arquivo Excel (.xlsx) para começar a visualizar os dados
            </p>
            <ExcelUpload onFileSelect={handleFileSelect} loading={loading} />
          </div>
        )}

        {hasData && data.envioDiario.length > 0 && (
          <DashboardTabs data={data} />
        )}
      </main>
    </div>
  );
}
