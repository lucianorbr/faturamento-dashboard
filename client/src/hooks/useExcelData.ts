import * as XLSX from 'xlsx';
import { useState, useCallback } from 'react';

export interface EnvioDiarioRow {
  consultor: string;
  conta: string;
  razaoSocial: string;
  cidade: string;
  objetivo: number;
  gross: number;
  r20: number;
  realizado: number;
  performance: number;
  falta100: number;
  pipeline: number;
  grupo: string;
  dms: string;
}

export interface NRCPDiarioRow {
  data: string;
  milhao: number;
}

export interface DashboardData {
  envioDiario: EnvioDiarioRow[];
  nrcpDiario: NRCPDiarioRow[];
}

export const useExcelData = () => {
  const [data, setData] = useState<DashboardData>({
    envioDiario: [],
    nrcpDiario: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processExcelFile = useCallback((file: File) => {
    setLoading(true);
    setError(null);
    console.log('Iniciando processamento do arquivo:', file.name);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          console.log('Arquivo lido, iniciando parse do Excel');
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });

          console.log('Abas disponíveis:', workbook.SheetNames);

          // Process "Envio diario" sheet
          const envioDiarioSheet = workbook.Sheets['Envio diario'];
          if (!envioDiarioSheet) {
            throw new Error('Aba "Envio diario" não encontrada');
          }
          // A linha 3 (índice 2) contém os cabeçalhos
          const envioDiarioData = XLSX.utils.sheet_to_json(envioDiarioSheet, { header: 0, range: 2 });
          console.log('Dados Envio Diario:', envioDiarioData.length, 'linhas');

          // Process "NRCP Diário" sheet
          const nrcpSheet = workbook.Sheets['NRCP Diário'];
          if (!nrcpSheet) {
            throw new Error('Aba "NRCP Diário" não encontrada');
          }
          const nrcpData = XLSX.utils.sheet_to_json(nrcpSheet, { header: 0 });
          console.log('Dados NRCP Diário:', nrcpData.length, 'linhas');

          // Transform Envio Diario data
          const processedEnvioDiario = (envioDiarioData as any[])
            .filter((row) => row['Consultor'] && row['Consultor'] !== 'Consultor' && row['Consultor'] !== undefined)
            .map((row) => ({
              consultor: String(row['Consultor'] || ''),
              conta: String(row['Conta'] || ''),
              razaoSocial: String(row['Razão Social'] || ''),
              cidade: String(row['Cidade/UF'] || ''),
              objetivo: parseFloat(row['Objetivo '] || row['Objetivo'] || 0),
              gross: parseFloat(row['Gross'] || 0),
              r20: parseFloat(row['R20'] || 0),
              realizado: parseFloat(row['Realizado'] || 0),
              performance: parseFloat(row['Performance'] || 0),
              falta100: parseFloat(row['Falta 100%'] || 0),
              pipeline: parseFloat(row['Pipeline'] || 0),
              grupo: String(row['Grupo'] || ''),
              dms: String(row['DMS'] || ''),
            }));

          // Transform NRCP Diario data
          const processedNRCP = (nrcpData as any[])
            .filter((row) => row['Data'] && !isNaN(parseFloat(row['Milhão'])))
            .map((row) => {
              // Converter data para formato legível
              let dataFormatada = String(row['Data'] || '');
              if (row['Data'] instanceof Date) {
                dataFormatada = row['Data'].toLocaleDateString('pt-BR');
              } else if (typeof row['Data'] === 'number') {
                // Excel serial date
                const date = new Date((row['Data'] - 25569) * 86400 * 1000);
                dataFormatada = date.toLocaleDateString('pt-BR');
              }
              return {
                data: dataFormatada,
                milhao: parseFloat(row['Milhão'] || 0),
              };
            });

          console.log('Dados processados:', {
            envioDiario: processedEnvioDiario.length,
            nrcpDiario: processedNRCP.length,
          });

          setData({
            envioDiario: processedEnvioDiario,
            nrcpDiario: processedNRCP,
          });
          setLoading(false);
        } catch (err) {
          const errorMsg = `Erro ao processar arquivo: ${err instanceof Error ? err.message : 'Desconhecido'}`;
          console.error(errorMsg, err);
          setError(errorMsg);
          setLoading(false);
        }
      };
      reader.onerror = () => {
        const errorMsg = 'Erro ao ler o arquivo';
        console.error(errorMsg);
        setError(errorMsg);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      const errorMsg = `Erro ao ler arquivo: ${err instanceof Error ? err.message : 'Desconhecido'}`;
      console.error(errorMsg, err);
      setError(errorMsg);
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    processExcelFile,
  };
};
