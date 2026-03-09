import { TrendingUp, DollarSign, Target, BarChart3, AlertCircle, Zap, TrendingDown } from 'lucide-react';
import { EnvioDiarioRow } from '@/hooks/useExcelData';

interface InfoCardsProps {
  data: EnvioDiarioRow[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export default function InfoCards({ data }: InfoCardsProps) {
  const calculateSum = (key: keyof EnvioDiarioRow) => {
    return data.reduce((sum, row) => {
      const value = row[key];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  };

  const objetivo = calculateSum('objetivo');
  const gross = calculateSum('gross');
  const r20 = calculateSum('r20');
  const realizado = calculateSum('realizado');
  const performance = data.length > 0 ? calculateSum('performance') / data.length : 0;
  const falta100 = calculateSum('falta100');
  const pipeline = calculateSum('pipeline');

  const cards = [
    {
      label: 'OBJETIVO',
      value: formatCurrency(objetivo),
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'GROSS',
      value: formatCurrency(gross),
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: 'R20',
      value: formatCurrency(r20),
      icon: Zap,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    },
    {
      label: 'REALIZADO',
      value: formatCurrency(realizado),
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      label: 'PERFORMANCE',
      value: formatPercentage(performance),
      icon: BarChart3,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      label: 'FALTA 100%',
      value: formatCurrency(falta100),
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
    },
    {
      label: 'PIPELINE',
      value: formatCurrency(pipeline),
      icon: TrendingDown,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`${card.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate">
                {card.label}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground break-words line-clamp-2">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
