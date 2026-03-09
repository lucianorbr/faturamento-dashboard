import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnvioDiarioRow } from '@/hooks/useExcelData';

interface InfoCardsProps {
  data: EnvioDiarioRow[];
}

export default function InfoCards({ data }: InfoCardsProps) {
  const calculateSum = (key: keyof EnvioDiarioRow) => {
    return data.reduce((sum, row) => {
      const value = row[key];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  };

  const cards = [
    {
      title: 'Objetivo',
      value: calculateSum('objetivo').toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      color: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Gross',
      value: calculateSum('gross').toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      color: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Realizado',
      value: calculateSum('realizado').toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      color: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Performance',
      value: (calculateSum('performance') / data.length).toFixed(2) + '%',
      color: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className={card.color}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
