import { DollarSign } from 'lucide-react';
import { NRCPDiarioRow } from '@/hooks/useExcelData';

interface NRCPInfoCardProps {
  data: NRCPDiarioRow[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function NRCPInfoCard({ data }: NRCPInfoCardProps) {
  const total = data.reduce((sum, row) => sum + row.milhao, 0);

  return (
    <div className="grid grid-cols-1 gap-3 mb-8">
      <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate">
            TOTAL NRCP
          </span>
        </div>
        <p className="text-sm font-bold text-foreground break-words line-clamp-2">
          {formatCurrency(total)}
        </p>
      </div>
    </div>
  );
}